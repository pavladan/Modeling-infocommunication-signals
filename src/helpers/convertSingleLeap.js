import fixed from "./fixed";
export default ({ amplitude, delay, range, numberPoints }) => {
  const data = [];
  const pointsFraq = fixed(range / numberPoints);

  for (let x = 0; x < range; x = fixed(x + pointsFraq)) {
    let y;
    if (x < delay) {
      y = 0;
    } else {
      y = amplitude;
    }
    data.push({ x, y });
  }
  return data;
};
