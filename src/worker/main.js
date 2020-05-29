import calcReaction from "../helpers/calcReaction";
import calcFunc from "../helpers/calcFunc";
import calcLeaps from "../helpers/calcLeaps";

const getChartData = (chart, range) => {
  const { start, end, numberPoints } = range;
  if (chart.initial) {
    if (chart.initial.type === "table") {
      return calcLeaps({
        leaps: chart.initial.leaps,
        start,
        end,
        numberPoints,
      });
    } else if (chart.initial.type === "func") {
      return calcFunc({
        func: chart.initial.func,
        start,
        end,
        numberPoints,
      });
    } else if (chart.initial.type === "result") {
      const signalData = getChartData(chart.initial.signal, range);
      return calcReaction(
        signalData,
        chart.initial.chain,
        chart.initial.centralFraq
      );
    }
  } else if (chart.data) {
    return chart.data.filter(({ x }) => x >= start && x < end);
  }
  return [];
};
const calc =(charts, { start, end, numberPoints })=>{
	const obj = {};
    charts
      .forEach((chart) => {
        const data = getChartData(chart, { start, end, numberPoints });
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
}
addEventListener("message", (e) => {
  const msg = e.data;
  if (msg.type === "calc") {
		const data = calc(msg.charts,msg.range)
		postMessage({
			type:'calc',
			data
		})
  }
});
