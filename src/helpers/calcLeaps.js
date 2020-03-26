import fixed from "./fixed";
export default ({ leaps = [], range, numberPoints }) => {
  const data = [];
  const pointsFraq = fixed(range / numberPoints);

  for (let x = 0; x < range; x = fixed(x + pointsFraq)) {
    let y = 0;
    for (let i = 0; i < leaps.length; i++) {
      const { amplitude, delay, fraquency, phase } = leaps[i];
      if (x >= delay) {
        if (amplitude) {
          if (fraquency) {
            y = fixed(
              y +
                fixed(
                  amplitude *
                    Math.cos(
                      fixed(x * fraquency) + fixed(phase * (Math.PI / 180))
                    )
                )
            );
          } else {
            y = fixed(y + amplitude);
          }
        }
      }
    }
    data.push({ x, y });
  }
  return data;
};
