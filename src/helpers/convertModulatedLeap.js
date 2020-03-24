import fixed from "./fixed";
export default ({
  amplitude,
  delay,
  fraquency,
  phase,
  range,
  numberPoints
}) => {
  const data = [];
  const pointsFraq = fixed(range / numberPoints);

  for (let x = 0; x < range; x = fixed(x + pointsFraq)) {
		let y;
		if (x < delay) {
      y = 0;
    } else {
			y = amplitude * Math.cos(fixed(x * fraquency) + fixed(phase*(Math.PI/180)));
		}
    data.push({ x, y: fixed(y) });
  }
  return data;
};
