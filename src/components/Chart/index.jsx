import React, { useState, useEffect } from "react";

import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Brush,
  Legend
} from "recharts";

export default function Chart() {
  const dataReacharts = [
    {
      x: 0,
      y1: 4000,
      y2: 2400
    },
    {
      x: 1,
      y1: 3000,
      y2: 1398
    },
    {
      x: 2,
      y1: 2000,
      y2: 9800
    },
    {
      x: 5,
      y1: 3780,
      y2: 2908
    },
    {
      x: 9,
      y1: 2780,
      y2: 3908
    },
    {
      x: 12,
      y1: 1000
    }
  ];
  const rechart = (
    <LineChart
      width={400}
      height={400}
      data={dataReacharts}
      margin={{ top: 30, right: 40, left: 10, bottom: 5 }}
    >
      <XAxis
        dataKey="x"
        type="number"
        domain={["dataMin", "dataMax"]}
        tickCount={20}
        interval={0}
        label={{ value: "time", position: "right", offset: 10 }}
        scale="time"
      />
      <YAxis
        type="number"
        domain={[0, "dataMax"]}
        label={{ value: "V", position: "top", offset: 10 }}
        interval="preserveStartEnd"
				scale={"linear"}
      />
      <Tooltip cursor={false} />
      <Legend verticalAlign="middle" align="right" iconType="circle" height={36} />
      <CartesianGrid stroke="#f5f5f5" />
      <Brush dataKey="x" height={20}/>
      <Line type="monotone" dataKey="y1" stroke="#ff7300" type="linear" />
      <Line type="monotone" dataKey="y2" stroke="#387908" type="linear" />
    </LineChart>
  );

  return <div className="Chart">{rechart}</div>;
}
