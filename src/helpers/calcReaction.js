import fixed from "./fixed";

const f = fixed;
export default function calcReaction(signalData, chainVar) {
  const {
    Cz,
    N1,
    N2,
    N3,
    N4,
    a1s,
    a2e,
    a3x,
    a4y,
    n1s,
    n2e,
    n3x,
    n4y,
    w2e,
    w4y,
  } = chainVar;
  const Psi = [];
  const T = signalData[signalData.length - 1].x;
  console.log(signalData, chainVar, T);
  for (let n = 0; n < signalData.length - 1; n++) {
    const fi_n = signalData[n].y;
    const fi_n1 = signalData[n + 1].y;
    const delta_t = signalData[n + 1].x - signalData[n].x;

    const a_n0 =
			f(fi_n1 - fi_n) / f(delta_t * f(fi_n - f(n * f(fi_n1 - fi_n))));
    const a_n1 =
			f(fi_n1 - fi_n) / f(delta_t * fi_n);
    const a_n2 =
			f(fi_n1 - fi_n) / f(delta_t * fi_n1);
			
    const C_n0 = f(-1 / f(fi_n - f(f(fi_n1 - fi_n) * n)));
		const C_n1 = f(-1 / fi_n);
		const C_n2 = f(-1 / fi_n1);
		
    const R_0_ozo =
      f(
        a_n0 *
          prod(1, N3, (i) => a3x[i]) *
          prod(1, N4, (i) => Math.pow(a4y[i], 2) + Math.pow(w4y[i], 2))
      ) /
      f(
        C_n0 *
          Cz *
          prod(1, N1, (i) => a1s[i]) *
          prod(1, N2, (i) => Math.pow(a2e[i], 2) + Math.pow(w2e[i], 2))
      );
    const R_1_ozo = f(
      R_0_ozo *
        f(
          sum(1, N3, (i) => 1 / a3x[i]) +
            1 / a_n0 +
            sum(
              1,
              N4,
              (i) =>
                f(2 * a4y[i]) / f(Math.pow(a4y[i], 2) + Math.pow(w4y[i], 2))
            ) -
            sum(1, N1, (i) => 1 / a1s[i]) -
            sum(
              1,
              N2,
              (i) =>
                f(2 * a2e[i]) / f(Math.pow(a2e[i], 2) + Math.pow(w2e[i], 2))
            )
        )
    );
    const M_11s = (i) => f(Math.pow(1 - Math.exp(a1s[i]), -1));
    const M_21s = (i) => f(Math.pow(Math.exp(-a1s[i]) - 1, -1));
    const _M_and_N_znam = (i) =>
      f(
        Math.exp(2 * a2e[i] * T) -
          2 * Math.exp(a2e[i] * T) * Math.cos(w2e[i] * T) +
          1
      );
    const M_12e = (i) =>
      f(f(Math.exp(a2e[i] * T) * Math.sin(w2e[i] * T)) / _M_and_N_znam(i));
    const N_12e = (i) =>
      f(f(1 - Math.exp(a2e[i] * T) * Math.cos(w2e[i] * T)) / _M_and_N_znam(i));
    const N_22e = (i) =>
      f(
        f(
          Math.exp(a2e[i] * T) * Math.cos(w2e[i] * T) - Math.exp(2 * a2e[i] * T)
        ) / _M_and_N_znam(i)
			);
			
			
    const Psi_n =
      -f(R_0_ozo * n * delta_t) - R_1_ozo + sum(1, N1, (i) => M_21s(i));
  }
}
function sum(from = 0, to = 0, callback) {
  let sum = 0;
  for (let i = from; i <= to; i++) {
    sum = f(sum + callback(i));
  }
  return sum;
}
function prod(from = 0, to = 0, callback) {
  let pr = 1;
  for (let i = from; i <= to; i++) {
    pr = f(pr * callback(i));
  }
  return sum;
}
