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
import fixed from "../../helpers/fixed";
import { InputNumber } from "antd";

export default function Chart(props) {
  const [data, setData] = useState([]);
  const [viewRange, setViewRange] = useState([0, 20]);
  const [numberPoints, setNumberPoints] = useState(1000);
  const chartRef = useRef(null);

  useEffect(() => {
    const interval = 200;
    let direction;
    let timeout;
    const onWheel = (e) => {
      if (
        e.path.some((p) => p.classList && p.classList.contains("chart-signals"))
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
    document.addEventListener("mousewheel", onWheel);
    return () => {
      document.removeEventListener("mousewheel", onWheel);
    };
  }, []);
  useEffect(() => {
    setData(
      calc({
        start: viewRange[0],
        end: viewRange[1],
        numberPoints,
      })
    );
  }, [props.charts, viewRange, numberPoints]);
  const calc = ({ start = 0, end = 200, numberPoints = 1000 } = {}) => {
    if (!props.charts || props.charts.length === 0) return [];
    const allCharts = props.charts;
    const obj = {};
    allCharts
      .filter((c) => c.show)
      .forEach((chart) => {
        let data = chart.data || [];
        if (chart.initial && chart.initial.type === "table") {
          data = calcLeaps({
            leaps: chart.initial.leaps,
            start,
            end,
            numberPoints,
          });
        }
        data.forEach((e) => {
          const x = e.x;
          const y = e.y;
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
    downEvent.preventDefault();
    let startX = downEvent.clientX;
    const onMove = (moveEvent) => {
      const offsetX = startX - moveEvent.clientX;
      moveChart(offsetX);
      startX = moveEvent.clientX;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", (_) => {
      document.removeEventListener("mousemove", onMove);
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
                isAnimationActive={false}
              />
            )
        )
      : null;
  const rechart = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 30, right: 40, left: 10, bottom: 5 }}
        onMouseDown={handleMove}
        ref={chartRef}
        className="chart-signals"
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
          domain={["dataMin", "dataMax"]}
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
      <div
        style={{
          flex: 0,
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <InputNumber
          size="small"
          min={0}
          value={viewRange[0]}
          onBlur={(e) => setViewRange((old) => [+e.target.value, old[1]])}
          onPressEnter={(e) => e.target.blur()}
        ></InputNumber>
        <InputNumber
          size="small"
          precision={0}
          value={numberPoints}
          onBlur={(e) => setNumberPoints(+e.target.value)}
          onPressEnter={(e) => e.target.blur()}
        ></InputNumber>
        <InputNumber
          size="small"
          value={viewRange[1]}
          onBlur={(e) => setViewRange((old) => [old[0], +e.target.value])}
          onPressEnter={(e) => e.target.blur()}
        ></InputNumber>
      </div>
    </div>
  );
}
