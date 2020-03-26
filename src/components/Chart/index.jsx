import React, { useState, useEffect } from "react";

import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Brush,
  Legend,
  ResponsiveContainer
} from "recharts";
import calcLeaps from "../../helpers/calcLeaps";

export default function Chart(props) {
  const mergeCharts = allCharts => {
    const obj = {};
    allCharts.forEach(chart => {
      let data = chart.data || [];
      if (chart.initial && chart.initial.type === "table") {
        data = calcLeaps({
          leaps: chart.initial.leaps,
          range: 10,
          numberPoints: 50
        });
      }
      data.forEach(e => {
        const x = e.x;
        const y = e.y;
        if (x !== undefined && y !== undefined) {
          if (!obj[x]) obj[x] = {};
          obj[x][chart.id] = y;
        }
      });
    });
    return Object.entries(obj)
      .map(e => ({ x: +e[0], ...e[1] }))
      .sort((a, b) => a.x - b.x);
  };
  const data =
    props.charts && props.charts.length > 0 ? mergeCharts(props.charts) : [];
  const lines =
    props.charts && props.charts.length > 0
      ? props.charts.map(
          l =>
            l.show && (
              <Line
                type="linear"
                dataKey={l.id || 0}
                stroke={l.color || "#000"}
                connectNulls
                name={l.name || ""}
                key={l.id || 0}
                dot={props.preview ? false : true}
              />
            )
        )
      : null;
  const rechart = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 30, right: 40, left: 10, bottom: 5 }}
      >
        <XAxis
          dataKey="x"
          type="number"
          domain={[0, "dataMax"]}
          interval="preserveStartEnd"
          label={{ value: "μs", position: "right", offset: 0 }}
          scale="linear"
        />
        <YAxis
          type="number"
          label={{ value: "V", position: "top", offset: 10 }}
          interval="preserveStartEnd"
          scale={"linear"}
        />
        {!props.preview ? <Tooltip cursor={false} /> : null}

        {props.charts.every(c => c.name) && (
          <Legend
            verticalAlign="middle"
            align="right"
            iconType="circle"
            height={36}
          />
        )}
        <CartesianGrid stroke={props.preview ? "#f5f5f5" : "#e1e4e7"} />
        {props.preview ? <Brush dataKey="x" height={20} /> : null}
        {lines}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="Chart" style={{ height: "100%", width: "100%" }}>
      {rechart}
    </div>
  );
}
