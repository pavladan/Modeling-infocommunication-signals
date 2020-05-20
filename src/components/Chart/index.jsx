import React, { useState, useEffect, useRef } from "react";

import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Brush,
  Legend,
  ResponsiveContainer,
} from "recharts";
import calcLeaps from "../../helpers/calcLeaps";
import calcFunc from "../../helpers/calcFunc";
import fixed from "../../helpers/fixed";
import { InputNumber } from "antd";
import calcReaction from "../../helpers/calcReaction";

export default function Chart(props) {
  const [data, setData] = useState([]);
  const [viewRange, setViewRange] = useState([0, 20]);
  const [renderRange, setRenderRange] = useState([0, 29]);
  const [numberPoints, setNumberPoints] = useState(400);
  const [moving, setMoving] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    props.staticRange !== undefined &&
      setViewRange((old) => [old[0], props.staticRange]);
  }, [props.staticRange]);

  useEffect(() => {
    console.log(
      "Need FIX NaN and Infinity and -Infinity !!!",
      "\nDont job <= and Integral !!!!!!"
    );
    const interval = 200;
    let direction;
    let timeout;
    const onWheel = (e) => {
      if (
        chartRef.current.container &&
        chartRef.current.container.contains(e.target)
      ) {
        if (e.deltaY) {
          if (!direction) {
            direction = "y";
            timeout = setTimeout(() => {
              direction = undefined;
            }, interval);
          } else if (direction === "y") {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              direction = undefined;
            }, interval);
            zoomChart(e.deltaY);
          }
        }
        if (e.deltaX) {
          if (!direction) {
            direction = "x";
            timeout = setTimeout(() => {
              direction = undefined;
            }, interval);
          } else if (direction === "x") {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              direction = undefined;
            }, interval);
            moveChart(e.deltaX);
          }
        }
      }
    };
    if (!props.preview) {
      document.addEventListener("mousewheel", onWheel);
    }
    return () => {
      !props.preview && document.removeEventListener("mousewheel", onWheel);
    };
  }, []);
  useEffect(() => {
    setData(
      calc({
        start: renderRange[0],
        end: renderRange[1],
        numberPoints,
      })
    );
  }, [props.charts, renderRange, numberPoints]);
  const calc = ({ start, end, numberPoints }) => {
		if (!props.charts || props.charts.length === 0) return [];
		console.log('calc')
    const allCharts = props.charts;
    const obj = {};
    allCharts
      .filter((c) => c.show)
      .forEach((chart) => {
        let data = [];
        if (chart.initial && chart.initial.type === "table") {
          data = calcLeaps({
            leaps: chart.initial.leaps,
            start,
            end,
            numberPoints,
          });
        } else if (chart.initial && chart.initial.type === "func") {
          data = calcFunc({
            func: chart.initial.func,
            start,
            end,
            numberPoints,
          });
        } else if (chart.data) {
          data = chart.data.filter(({ x }) => x >= start && x < end);
        }
        data.forEach((e) => {
          let x = e.x;
          let y = e.y;
          if (y === -Infinity || y === Infinity || y === NaN) {
            y = undefined;
          }
          if (x !== undefined && y !== undefined) {
            if (!obj[x]) obj[x] = {};
            obj[x][chart.id] = y;
          }
        });
      });
    return Object.entries(obj)
      .map((e) => ({ x: +e[0], ...e[1] }))
      .sort((a, b) => a.x - b.x);
  };
  const calcValueFromPx = (px) => {
    const widthChartPx = chartRef.current.state.offset.width;
    const widthValue = viewRange[1] - viewRange[0];
    return fixed((widthValue / widthChartPx) * px);
  };
  const zoomChart = (px) => {
    const offsetValue = calcValueFromPx(px);
    setViewRange((old) => {
      const newMin = +(old[0] - offsetValue).toFixed(3);
      const newMax = +(old[1] + offsetValue).toFixed(3);
      if (newMax <= newMin || newMax - newMin < 1 || newMax - newMin > 300)
        return old;
      if (newMin < 0) {
        return [0, newMax];
      }

      return [newMin, newMax];
    });
  };
  const moveChart = (px) => {
    const offsetValue = calcValueFromPx(px);
    setViewRange((old) => {
      if (old[0] + offsetValue < 0) {
        return [0, +(old[1] - old[0]).toFixed(3)];
      }

      return [
        +(old[0] + offsetValue).toFixed(3),
        +(old[1] + offsetValue).toFixed(3),
      ];
    });
  };
  const handleMove = (_, downEvent) => {
    setMoving(true);
    let startX = downEvent.clientX;
    const onMove = (moveEvent) => {
      const offsetX = startX - moveEvent.clientX;
      moveChart(offsetX);
      startX = moveEvent.clientX;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", (_) => {
      document.removeEventListener("mousemove", onMove);
      setMoving(false);
    });
  };
  const lines =
    props.charts && props.charts.length > 0
      ? props.charts.map(
          (l) =>
            l.show && (
              <Line
                type="linear"
                dataKey={l.id || 0}
                stroke={l.color || "#000"}
                connectNulls
                name={l.name || ""}
                key={l.id || 0}
                dot={false}
                isAnimationActive={!!props.preview}
              />
            )
        )
      : null;
  const rechart = (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minWidth={110}
      minHeight={110}
    >
      <LineChart
        data={data}
        margin={{ top: 30, right: 40, left: 10, bottom: 5 }}
        onMouseDown={!props.preview && handleMove}
        ref={chartRef}
        style={{ userSelect: "none", cursor: moving ? "grabbing" : "grab" }}
      >
        <XAxis
          allowDataOverflow
          dataKey="x"
          type="number"
          domain={viewRange}
          // interval="preserveStartEnd"
          label={{ value: "μs", position: "right", offset: 0 }}
          // scale="linear"
        />
        <YAxis
          allowDataOverflow
          type="number"
          domain={[(dataMin) => dataMin - 0.1, (dataMax) => dataMax + 0.1]}
          label={{ value: "V", position: "top", offset: 10 }}
          interval="preserveStartEnd"
          scale={"linear"}
        />
        {/* {!props.preview ? <Tooltip cursor={false} /> : null} */}

        {/* {props.charts.every((c) => c.name) && (
          <Legend
            verticalAlign="middle"
            align="right"
            iconType="circle"
            height={36}
          />
        )} */}
        <CartesianGrid stroke={props.preview ? "#f5f5f5" : "#e1e4e7"} />
        {lines}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div
      className="Chart"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ flex: 1 }}>{rechart}</div>
      {!props.preview && (
        <div
          style={{
            flex: 0,
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <InputNumber
						disabled
            size="small"
            value={renderRange[0]}
            onPressEnter={(e) => e.target.blur()}
            onChange={(e) => {
              if (typeof e === "number" && e >= 0) {
                setRenderRange((old) => {
                  if (e < old[1]) return [e, old[1]];
                  return old;
                });
              }
            }}
            parser={(e) => {
              if (e.slice(-1) === ",") return e.slice(0, -1) + ".";
              return e;
            }}
          ></InputNumber>
          <InputNumber
            size="small"
            value={numberPoints}
            onChange={(e) => {
              if (
                typeof e === "number" &&
                e > 0 &&
                e < 10000 &&
                Number.isInteger(e)
              ) {
                setNumberPoints(e);
              } else if (e === null) setNumberPoints(500);
            }}
            onPressEnter={(e) => e.target.blur()}
          ></InputNumber>
          <InputNumber
            size="small"
            value={renderRange[1]}
            onPressEnter={(e) => e.target.blur()}
            onChange={(e) => {
              if (typeof e === "number" && e >= 0) {
                setRenderRange((old) => {
                  if (e > old[0]) return [old[0], e];
                  return old;
                });
              }
            }}
            parser={(e) => {
              if (e.slice(-1) === ",") return e.slice(0, -1) + ".";
              return e;
            }}
          ></InputNumber>
        </div>
      )}
    </div>
  );
}
