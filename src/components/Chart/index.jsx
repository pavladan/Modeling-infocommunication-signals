import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

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
import fixed from "../../helpers/fixed";
import { InputNumber, Form, Popover, Button, message, Spin } from "antd";
import { SettingOutlined, RestFilled } from "@ant-design/icons";

let worker = new Worker("../../worker/main.js", { type: "module" });

export default function Chart(props) {
  const [data, setData] = useState([]);
  const [viewRange, setViewRange] = useState([0, 10]);
  const [renderRange, setRenderRange] = useState([0, 10]);
  const [numberPoints, setNumberPoints] = useState(100);
  const [moving, setMoving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (props.staticRange !== undefined) {
      setViewRange((old) => [old[0], props.staticRange]);
      setRenderRange((old) => [old[0], props.staticRange]);
    }
  }, [props.staticRange]);

  useEffect(() => {
    const workerListener = (e) => {
      const resp = e.data;
      if (resp.type === "calc") {
        setLoadingData(false);
        setData(resp.data);
      }
    };
    worker.addEventListener("message", workerListener);
    worker.addEventListener("error", (err) => {
      console.error(err);
      message.error("Что-то пошло не так :(");
      setLoadingData(false);
    });
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
      worker.removeEventListener("message", workerListener);
    };
  }, []);

  const calc = ({ start, end, numberPoints }) => {
    if (!props.charts || props.charts.length === 0) return [];
    const allCharts = props.charts;
    if (worker) {
      worker.postMessage({
        type: "calc",
        charts: allCharts,
        range: { start, end, numberPoints },
      });
      setLoadingData(true);
    }
  };

  const prevCharts = usePrevious(props.charts);

  useMemo(() => {
    if (
      props.charts &&
      (!prevCharts ||
        JSON.stringify(prevCharts.map((e) => e.initial)) !==
          JSON.stringify(props.charts.map((e) => e.initial)))
    )
      calc({
        start: renderRange[0],
        end: renderRange[1],
        numberPoints,
      });
  }, [props.charts]);
  useMemo(() => {
    calc({
      start: renderRange[0],
      end: renderRange[1],
      numberPoints,
    });
	}, [renderRange, numberPoints]);
	useMemo(()=>{
		if(props.forceGetData){
			calc({
				start: renderRange[0],
				end: renderRange[1],
				numberPoints,
			});
		}
	},[props.forceGetData])
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
        style={{
          userSelect: "none",
          cursor: props.preview ? "default" : moving ? "grabbing" : "grab",
        }}
      >
        <XAxis
          allowDataOverflow
          dataKey="x"
          type="number"
          domain={viewRange}
          // interval="preserveStartEnd"
          label={{ value: "мкс", position: "right", offset: 0 }}
          // scale="linear"
        />
        <YAxis
          allowDataOverflow
          type="number"
          domain={[(dataMin) => dataMin - 0.1, (dataMax) => dataMax + 0.1]}
          label={{ value: "В", position: "top", offset: 10 }}
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
      {!props.preview && loadingData && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1031,
          }}
        >
          <Spin size="large" spinning={loadingData} />
        </div>
      )}
      {!props.preview && (
        <Popover
          trigger="click"
          placement="bottomRight"
          content={
            <div
              style={{
                flex: 0,
                marginBottom: 20,
              }}
            >
              <Form>
                <Form.Item label="Интервал отображения">
                  <InputNumber
                    size="small"
                    defaultValue={renderRange[1]}
                    onPressEnter={(e) => e.target.blur()}
                    min={0}
                    onBlur={(e) => {
                      setRenderRange((old) => {
                        if (+e.target.value > old[0]) return [old[0], +e.target.value];
                        return old;
                      });
                    }}
                    parser={(e) => {
                      if (e.slice(-1) === ",") return e.slice(0, -1) + ".";
                      return e;
                    }}
                  ></InputNumber>
                </Form.Item>
                <Form.Item label="Количество отсчетных точек на интервале отображения">
                  <InputNumber
                    size="small"
                    defaultValue={numberPoints}
                    onPressEnter={(e) => e.target.blur()}
                    placeholder="2..10000"
                    min={2}
                    max={10000}
                    precision={0}
                    onBlur={(e) => {
                      setNumberPoints(+e.target.value);
                    }}
                  ></InputNumber>
                </Form.Item>
              </Form>
            </div>
          }
          title="Параметры отображения графиков"
        >
          <Button
            type="default"
            icon={<SettingOutlined />}
            shape="circle"
            style={{ position: "absolute", top: 10, right: 10 }}
          ></Button>
        </Popover>
      )}
    </div>
  );
}

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
