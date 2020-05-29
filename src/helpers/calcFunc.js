import fixed from "./fixed";
import math from "./math";

export default ({ func, start = 0, end, numberPoints }) => {
  const data = [];
  const pointsFraq = fixed((end - start) / numberPoints);

  for (let x = start; x <= end; x = fixed(x + pointsFraq)) {
    let y;
    if (func) {
      y = parseMathJSON({ json: func, start, end, fraq: pointsFraq }, { t: x });
    }
    data.push({ x, y });
  }
  return data;
};
function parseMathJSON({ json, start = 0, end = 0, fraq }, mainVariables = {}) {
  const main = (obj, variables) => {
    try {
      if (obj === undefined) return;
      const _main = (o, v = variables) => main(o, v);
      if (typeof obj === "number") {
        return obj;
      } else if (
        obj.sup &&
        !(obj.fn === "sum" || obj.fn === "prod" || obj.fn === "cot")
      ) {
        return fixed(
          Math.pow(
            fixed(_main({ ...obj, sup: undefined })),
            fixed(_main(obj.sup))
          )
        );
      } else if (obj.fn) {
        if (obj.arg) {
          if (obj.fn === "multiply") {
            return fixed(obj.arg.reduce((acc, e) => acc * _main(e), 1));
          } else if (obj.fn === "subtract") {
            return fixed(
              _main(obj.arg[0]) - (obj.arg[1] ? _main(obj.arg[1]) : 0)
            );
          } else if (obj.fn === "add") {
            return fixed(obj.arg.reduce((acc, e) => acc + _main(e), 0));
          } else if (obj.fn === "divide") {
            if (obj.arg[0] === undefined || obj.arg[1] === undefined)
              return NaN;
            return fixed(_main(obj.arg[0]) / _main(obj.arg[1]));
          } else if (obj.fn === "sin") {
            return fixed(Math.sin(_main(obj.arg[0])));
          } else if (obj.fn === "arcsin") {
            return fixed(Math.asin(_main(obj.arg[0])));
          } else if (obj.fn === "cos") {
            return fixed(Math.cos(_main(obj.arg[0])));
          } else if (obj.fn === "arccos") {
            return fixed(Math.acos(_main(obj.arg[0])));
          } else if (obj.fn === "tan") {
            return fixed(Math.tan(_main(obj.arg[0])));
          } else if (obj.fn === "arctan") {
            return fixed(Math.atan(_main(obj.arg[0])));
          } else if (obj.fn === "ln") {
            if (obj.sub !== undefined) {
              return fixed(
                Math.log(_main(obj.arg[0])) / Math.log(_main(obj.sub))
              );
            }
            return fixed(Math.log(_main(obj.arg[0])));
          } else if (
            obj.fn === "log" &&
            obj.arg !== undefined &&
            obj.sub !== undefined
          ) {
            return fixed(
              Math.log(_main(obj.arg[0])) / Math.log(_main(obj.sub))
            );
          } else if (obj.fn === "negate") {
            if (obj.arg[0] === undefined) return NaN;
            return fixed(-1 * _main(obj.arg[0]));
          } else if (obj.fn === "abs") {
            if (obj.arg[0] === undefined) return NaN;
            return fixed(Math.abs(_main(obj.arg[0])));
          } else if (obj.fn === "sqrt") {
            if (obj.arg[0] === undefined) return NaN;
            return fixed(Math.sqrt(_main(obj.arg[0])));
          } else if (obj.fn === "sign") {
            return fixed(Math.sign(_main(obj.arg[0])));
          } else if (obj.fn === "ceil" && obj.arg) {
            return fixed(Math.ceil(_main(obj.arg[0])));
          } else if (obj.fn === "floor" && obj.arg) {
            return fixed(Math.floor(_main(obj.arg[0])));
          } else if (obj.fn === "round" && obj.arg) {
            return fixed(Math.round(_main(obj.arg[0])));
          } else if (
            (obj.fn === "sum" || obj.fn === "prod") &&
            obj.arg[0] &&
            obj.sup &&
            obj.sub &&
            obj.sub.fn === "equal" &&
            obj.sub.arg[1] &&
            obj.sub.arg[0].sym
          ) {
            let sumOrProd;
            if (obj.fn === "sum") {
              sumOrProd = math.sum;
            } else if (obj.fn === "prod") {
              sumOrProd = math.prod;
            }
            return fixed(
              sumOrProd(_main(obj.sub.arg[1]), _main(obj.sup), (i) =>
                _main(obj.arg[0], { ...variables, [obj.sub.arg[0].sym]: i })
              )
            );
          } else if (
            (obj.fn === "differentialD" &&
              obj.arg[0] &&
              obj.arg[0].fn === "cot" &&
              obj.arg[1]) ||
            (obj.fn === "cot" &&
              obj.arg[0] &&
              obj.arg[0].fn === "differentialD" &&
              obj.arg[0].arg[0] &&
              obj.arg[0].arg[1])
          ) {
            // fexed \int - integral
            let sub, sup, body, sym;
            if (obj.fn === "differentialD") {
              sub = obj.arg[0].sub || start;
              sup = obj.arg[0].sup || end;
              body = obj.arg[0].arg[0];
              sym = obj.arg[1].sym;
            } else if ((obj.fn = "cot")) {
              sub = obj.sub || start;
              sup = obj.sup || end;
              body = obj.arg[0].arg[0];
              sym = obj.arg[0].arg[1].sym;
            }
            if (
              sub === undefined ||
              sup === undefined ||
              body === undefined ||
              sym === undefined
            )
              return;
            return fixed(
              math.integral(_main(sub), _main(sup), fraq, (i) =>
                _main(body, {
                  ...variables,
                  [sym]: i,
                })
              )
            );
          } else if (obj.fn === "brace" && obj.arg[0]) {
            if (obj.arg[0].fn === "list") {
              return obj.arg[0].arg.some(
                (a) => fixed(_main(a)) === variables.t
              );
            } else {
              return fixed(_main(obj.arg[0])) === variables.t;
            }
          } else if (obj.fn === "list") {
            if (obj.arg.length > 1) {
              const parentheses = [];
              const squareBrackets = [];
              for (let i = 1; i < obj.arg.length; i++) {
                const cur = _main(obj.arg[i]);
                const next = obj.arg[i + 1] && _main(obj.arg[i + 1]);
                if (typeof cur === "number" && typeof next === "number") {
                  parentheses.push([cur, next]);
                  i++;
                } else if (typeof cur === "boolean") {
                  squareBrackets.push(cur);
                }
              }
              if (
                parentheses.some(
                  (e) => variables.t > e[0] && variables.t < e[1]
                ) ||
                squareBrackets.some((e) => e === true)
              ) {
                return fixed(_main(obj.arg[0]));
              }
            }
          } else if (
            obj.fn.includes("brack") &&
            obj.arg[0] &&
            obj.arg[0].fn === "list" &&
            obj.arg[0].arg &&
            obj.arg[0].arg.length === 2
          ) {
            const rightValue = [
              fixed(_main(obj.arg[0].arg[0])),
              fixed(_main(obj.arg[0].arg[1])),
            ];
            if (obj.fn === "\\lbrack\\rbrack") {
              return (
                variables.t >= rightValue[0] && variables.t <= rightValue[1]
              );
            } else if (obj.fn === "(\\rbrack") {
              return (
                variables.t > rightValue[0] && variables.t <= rightValue[1]
              );
            } else if (obj.fn === "\\lbrack)") {
              return (
                variables.t >= rightValue[0] && variables.t < rightValue[1]
              );
            }
          } else if (obj.fn === "lt" && obj.arg.length === 2) {
            return fixed(_main(obj.arg[0])) < fixed(_main(obj.arg[1]));
          } else if (obj.fn === "gt" && obj.arg.length === 2) {
            return fixed(_main(obj.arg[0])) > fixed(_main(obj.arg[1]));
          } else if (obj.fn === "ge" && obj.arg.length === 2) {
            return fixed(_main(obj.arg[0])) >= fixed(_main(obj.arg[1]));
          } else if (obj.fn === "similar" && obj.arg.length === 2) {
            // it is fixed \le - <=
            return fixed(_main(obj.arg[0])) <= fixed(_main(obj.arg[1]));
          } else if (obj.fn === "equal" && obj.arg.length === 2) {
            return fixed(_main(obj.arg[0])) === fixed(_main(obj.arg[1]));
          } else if (obj.fn === "ne" && obj.arg.length === 2) {
            return fixed(_main(obj.arg[0])) !== fixed(_main(obj.arg[1]));
          } else if (obj.fn === "elementof" && obj.arg.length === 2) {
            const leftValue = fixed(_main(obj.arg[0]));
            if (obj.arg[1].fn === "list" && obj.arg[1].arg.length === 2) {
              return (
                leftValue > fixed(_main(obj.arg[1].arg[0])) &&
                leftValue < fixed(_main(obj.arg[1].arg[1]))
              );
            } else if (
              obj.arg[1].fn &&
              obj.arg[1].fn.includes("brack") &&
              obj.arg[1].arg[0] &&
              obj.arg[1].arg[0].fn === "list" &&
              obj.arg[1].arg[0].arg &&
              obj.arg[1].arg[0].arg.length === 2
            ) {
              const rightValue = [
                fixed(_main(obj.arg[1].arg[0].arg[0])),
                fixed(_main(obj.arg[1].arg[0].arg[1])),
              ];
              if (obj.arg[1].fn === "\\lbrack\\rbrack") {
                return leftValue >= rightValue[0] && leftValue <= rightValue[1];
              } else if (obj.arg[1].fn === "(\\rbrack") {
                return leftValue > rightValue[0] && leftValue <= rightValue[1];
              } else if (obj.arg[1].fn === "\\lbrack)") {
                return leftValue >= rightValue[0] && leftValue < rightValue[1];
              }
            } else if (obj.arg[1].fn === "brace" && obj.arg[1].arg[0]) {
              if (obj.arg[1].arg[0].fn === "list") {
                return obj.arg[1].arg[0].arg.some(
                  (a) => fixed(_main(a)) === leftValue
                );
              } else {
                return fixed(_main(obj.arg[1].arg[0])) === leftValue;
              }
            } else {
              const rightValue = _main(obj.arg[1]);
              if (rightValue) {
                return fixed(rightValue) === leftValue;
              }
            }
          } else if (obj.fn === "f") {
            if (obj.arg.length === 1) {
              const newT = fixed(_main(obj.arg[0]));
              if (newT !== variables.t && newT >= start && newT <= end) {
                const y = _main(json, { t: newT });
                return y && fixed(y);
              }
            }
          }
        } else if (obj.args) {
          if (obj.fn === "cases") {
            for (let i = 0; i < obj.args.length; i++) {
              if (obj.args[i][0]) {
                if (
                  obj.args[i][0].fn === "f" &&
                  obj.args[i][0].arg &&
                  obj.args[i][0].arg.length === 1
                ) {
                  const newT = fixed(_main(obj.args[i][0].arg[0]));
                  if (newT !== variables.t && newT >= start && newT <= end) {
                    const y = _main(obj, { t: newT });
                    return y && fixed(y);
                  }
                }
                const responseComprasion = _main(obj.args[i][0]);
                if (responseComprasion !== undefined) {
                  return responseComprasion;
                }
              }
            }
          }
        } else {
          return NaN;
        }
      } else if (obj.group) {
        return fixed(_main(obj.group));
      } else if (obj.num) {
        return +obj.num;
      } else if (obj.sym) {
        let value = variables[obj.sym];
        if (value === undefined) {
          if (obj.sym === "π") {
            value = Math.PI;
          } else if (obj.sym === "∞") {
            value = Infinity;
          } else if (obj.sym === "∅") {
            value = undefined;
          } else if (obj.sym === "e") {
            value = Math.E;
          } else {
            value = NaN;
          }
        }
        return value;
      }
    } catch (err) {
      console.error(err);
    }
  };
  return main(json, mainVariables);
}
