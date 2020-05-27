import fixed from "./fixed";
import math from "./math";
import Complex from "Complex";

const f = fixed;

function normalizing(data) {
  const arrY = data.map((e) => e.y);
  let fi_max = arrY[0];
  for (let i = 1; i < arrY.length; i++) {
    if (Math.abs(arrY[i]) > Math.abs(fi_max)) {
      fi_max = arrY[i];
    }
  }
  const fi_dop = fi_max * math.pow(10, -7);
  return data.map((e) => {
    const newEl = { ...e };
    if (newEl.y === 0) {
      newEl.y = fi_dop;
    }
    return newEl;
  });
}

export default function calcReaction(signalData, chainVar, centralFraq) {
  signalData = normalizing(signalData);
  console.log(signalData, chainVar);
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
  const Kz = (P, exceptions = {}) => {
    return f(
      f(
        math.prod(1, N3, (i) => (exceptions.N3 !== i ? P + a3x[i] : 1)) *
          math.prod(1, N4, (i) =>
            exceptions.N4 !== i
              ? math.pow(P, 2) +
                f(2 * a4y[i] * P) +
                math.pow(a4y[i], 2) +
                math.pow(w4y[i], 2)
              : 1
          )
      ) /
        f(
          Cz *
            math.prod(1, N1, (i) => (exceptions.N1 !== i ? P + a1s[i] : 1)) *
            math.prod(1, N2, (i) =>
              exceptions.N2 !== i
                ? math.pow(P, 2) +
                  f(2 * a2e[i] * P) +
                  math.pow(a2e[i], 2) +
                  math.pow(w2e[i], 2)
                : 1
            )
        )
    );
  };
  const KzComplex = (P, exceptions = {}) => {
    P.finalize();
    return math
      .prodComplex(1, N3, (i) =>
        exceptions.N3 !== i ? P.add(a3x[i]) : Complex.from(1)
      )
      .multiply(
        math.prodComplex(1, N4, (i) =>
          exceptions.N4 !== i
            ? P.pow(2)
                .add(P.multiply(2 * a4y[i]))
                .add(math.pow(a4y[i], 2))
                .add(math.pow(w4y[i], 2))
            : Complex.from(1)
        )
      )
      .divide(
        math
          .prodComplex(1, N1, (i) =>
            exceptions.N1 !== i ? P.add(a1s[i]) : Complex.from(1)
          )
          .multiply(
            math.prodComplex(1, N2, (i) =>
              exceptions.N2 !== i
                ? P.pow(2)
                    .add(P.multiply(2 * a2e[i]))
                    .add(math.pow(a2e[i], 2))
                    .add(math.pow(w2e[i], 2))
                : Complex.from(1)
            )
          )
          .multiply(Cz)
      );
  };
  const Psi = [];
  const N = signalData.length - 1;
  const T = f(signalData[N - 1].x * centralFraq);
  const delta_t = signalData[1]
    ? f((signalData[1].x - signalData[0].x) * centralFraq)
    : 0;

  const fi_n = (n) => signalData[n].y;
  const fi_n1 = (n) => signalData[n + 1].y;

  const a_n0 = (n) =>
    f(
      f(fi_n1(n) - fi_n(n)) /
        f(delta_t * f(fi_n(n) - f(n * f(fi_n1(n) - fi_n(n)))))
    );
  const a_n1 = (n) => f(f(fi_n1(n) - fi_n(n)) / f(delta_t * fi_n(n)));
  const a_n2 = (n) => f(f(fi_n1(n) - fi_n(n)) / f(delta_t * fi_n1(n)));

  const C_n0 = (n) => f(-1 / f(fi_n(n) - f(f(fi_n1(n) - fi_n(n)) * n)));
  const C_n1 = (n) => f(-1 / fi_n(n));
  const C_n2 = (n) => f(-1 / fi_n1(n));

  const R_0_ozo_without_a_n0 = (n) =>
    f(
      math.prod(1, N3, (i) => a3x[i]) *
        math.prod(1, N4, (i) => math.pow(a4y[i], 2) + math.pow(w4y[i], 2))
    ) /
    f(
      C_n0(n) *
        Cz *
        math.prod(1, N1, (i) => a1s[i]) *
        math.prod(1, N2, (i) => math.pow(a2e[i], 2) + math.pow(w2e[i], 2))
    );

  const R_0_ozo = (n) => f(R_0_ozo_without_a_n0(n) * a_n0(n));

  const R_1_ozo = (n) => {
    if (fi_n(n) === fi_n1(n)) {
      return R_0_ozo_without_a_n0(n);
    }
    return f(
      R_0_ozo(n) *
        f(
          math.sum(1, N3, (i) => 1 / a3x[i]) +
            1 / a_n0(n) +
            math.sum(
              1,
              N4,
              (i) =>
                f(2 * a4y[i]) / f(math.pow(a4y[i], 2) + math.pow(w4y[i], 2))
            ) -
            math.sum(1, N1, (i) => 1 / a1s[i]) -
            math.sum(
              1,
              N2,
              (i) =>
                f(2 * a2e[i]) / f(math.pow(a2e[i], 2) + math.pow(w2e[i], 2))
            )
        )
    );
  };
  const R_0_jz1s = (a_nj, C_nj, i) =>
    f(
      f(f(-a1s[i] + a_nj) / f(C_nj * math.pow(-a1s[i], 2))) *
        Kz(-a1s[i], {
          N1: i,
        })
    );
  const R_0_1z1s = (n, i) => R_0_jz1s(a_n1(n), C_n1(n), i);
  const R_0_2z1s = (n, i) => R_0_jz1s(a_n2(n), C_n2(n), i);

  const R_0_jz2eComplex = (a_nj, C_nj, i) => {
    const P = Complex.from(-a2e[i], w2e[i]).finalize();
    return P.add(a_nj)
      .divide(P.pow(2).multiply(C_nj))
      .multiply(
        KzComplex(P, {
          N2: i,
        })
      );
  };
  const R_0_1z2e = (n, i) => f(R_0_jz2eComplex(a_n1(n), C_n1(n), i).abs());
  const fi_0_1z2e = (n, i) => f(R_0_jz2eComplex(a_n1(n), C_n1(n), i).angle());
  const R_0_2z2e = (n, i) => f(R_0_jz2eComplex(a_n2(n), C_n2(n), i).abs());
  const fi_0_2z2e = (n, i) => f(R_0_jz2eComplex(a_n2(n), C_n2(n), i).angle());

  const M_11s = (i) => f(math.pow(1 - math.exp(a1s[i]), -1));
  const M_21s = (i) => f(math.pow(math.exp(-a1s[i]) - 1, -1));
  const _M_and_N_znam = (i) =>
    f(
      math.exp(2 * a2e[i] * T) -
        2 * math.exp(a2e[i] * T) * math.cos(w2e[i] * T) +
        1
    );
  const M_12e = (i) =>
    f(f(math.exp(a2e[i] * T) * math.sin(w2e[i] * T)) / _M_and_N_znam(i));
  const N_12e = (i) =>
    f(f(1 - math.exp(a2e[i] * T) * math.cos(w2e[i] * T)) / _M_and_N_znam(i));
  const N_22e = (i) =>
    f(
      f(
        math.exp(a2e[i] * T) * math.cos(w2e[i] * T) - math.exp(2 * a2e[i] * T)
      ) / _M_and_N_znam(i)
    );
  for (let n = 0; n <= N - 1; n++) {
    const sum1 = math.sum(
      1,
      N1,
      (s) =>
        f(
          f(M_21s(s) * R_0_1z1s(n, s)) -
            f(M_11s(s) * R_0_2z1s(n, s) * math.exp(a1s[s] * delta_t))
        ) +
        math.sum(
          n + 1,
          N - 1,
          (k) =>
            M_11s(s) *
            f(
              f(R_0_1z1s(k, s) * math.exp(a1s[s] * (k - n) * delta_t)) -
                f(R_0_2z1s(k, s) * math.exp(a1s[s] * (k - n + 1) * delta_t))
            )
        ) +
        math.sum(
          1,
          n,
          (k) =>
            M_21s(s) *
            f(
              f(R_0_1z1s(n - k, s) * math.exp(-a1s[s] * k * delta_t)) -
                f(R_0_2z1s(n - k, s) * math.exp(-a1s[s] * (k - 1) * delta_t))
            )
        )
    );
    const sum2 = math.sum(
      1,
      N2,
      (l) =>
        f(
          f(
            f(R_0_1z2e(n, l) / w2e[l]) *
              f(
                f(N_22e(l) * math.sin(fi_0_1z2e(n, l))) -
                  f(M_12e(l) * math.cos(fi_0_1z2e(n, l)))
              )
          ) -
            f(
              f(R_0_2z2e(n, l) / w2e[l]) *
                math.exp(a2e[l] * delta_t) *
                f(
                  N_12e(l) * math.sin(-w2e[l] * delta_t + fi_0_2z2e(n, l)) -
                    M_12e(l) * math.cos(-w2e[l] * delta_t + fi_0_2z2e(n, l))
                )
            )
        ) +
        math.sum(n + 1, N - 1, (k) =>
          f(
            f(R_0_1z2e(k, l) / w2e[l]) *
              math.exp(a2e[l] * (k - n) * delta_t) *
              f(
                f(
                  N_12e(l) *
                    math.sin(w2e[l] * (n - k) * delta_t + fi_0_1z2e(k, l))
                ) -
                  f(
                    M_12e(l) *
                      math.cos(w2e[l] * (n - k) * delta_t + fi_0_1z2e(k, l))
                  )
              ) -
              f(
                f(R_0_2z2e(k, l) / w2e[l]) *
                  math.exp(a2e[l] * (k - n + 1) * delta_t) *
                  f(
                    N_12e(l) *
                      math.sin(
                        w2e[l] * (n - k - 1) * delta_t + fi_0_2z2e(k, l)
                      ) -
                      M_12e(l) *
                        math.cos(
                          w2e[l] * (n - k - 1) * delta_t + fi_0_2z2e(k, l)
                        )
                  )
              )
          )
        ) +
        math.sum(1, n, (k) =>
          f(
            f(R_0_1z2e(n - k, l) / w2e[l]) *
              math.exp(-a2e[l] * k * delta_t) *
              f(
                N_22e(l) *
                  math.sin(w2e[l] * k * delta_t + fi_0_1z2e(n - k, l)) -
                  M_12e(l) *
                    math.cos(w2e[l] * k * delta_t + fi_0_1z2e(n - k, l))
              ) -
              f(
                f(R_0_2z2e(n - k, l) / w2e[l]) *
                  math.exp(-a2e[l] * (k - 1) * delta_t) *
                  f(
                    N_22e(l) *
                      math.sin(
                        w2e[l] * (k - 1) * delta_t + fi_0_2z2e(n - k, l)
                      ) -
                      M_12e(l) *
                        math.cos(
                          w2e[l] * (k - 1) * delta_t + fi_0_2z2e(n - k, l)
                        )
                  )
              )
          )
        )
    );
    const Psi_n = -f(R_0_ozo(n) * n * delta_t) - R_1_ozo(n) + sum1 + sum2;

    console.log("-----------------", n, "---------------");
    console.log("fi_n/fi_n+1", fi_n(n), fi_n1(n));
    console.log("a_n0(1,2)", a_n0(n), a_n1(n), a_n2(n));
    console.log("C_n0(1,2)", C_n0(n), C_n1(n), C_n2(n));
    console.log("R_0/1_ozo", R_0_ozo(n), R_1_ozo(n));
    console.log("R_0_jz1s", R_0_1z1s(n, 1), R_0_2z1s(n, 1));
    console.log("R_0_1z2e/fi_0_1z2e", R_0_1z2e(n, 1), fi_0_1z2e(n, 1));
    console.log("R_0_2z2e/fi_0_2z2e", R_0_2z2e(n, 1), fi_0_2z2e(n, 1));
    console.log("M1(2)1s", M_11s(1), M_21s(1));
    console.log("M(N)12e", M_12e(1), N_12e(1), N_22e(1));
    Psi.push({ x: f(n * delta_t), y: f(Psi_n) });
  }
  console.log(Psi);
  return Psi;
}
