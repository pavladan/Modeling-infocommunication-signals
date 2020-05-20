import fixed from "./fixed";
import math from "./math";

export default ({ func, start = 0, end, numberPoints }) => {
  const data = [];
  const pointsFraq = fixed((end - start) / numberPoints);

  for (let x = start; x < end; x = fixed(x + pointsFraq)) {
    let y;
    if (func) {
      y = parseMathJSON(func, { t: x });
    }
    data.push({ x, y });
  }
  return data;
};
function parseMathJSON(json, mainVariables = {}) {
  const main = (obj, variables) => {
    const _main = (o, v = variables) => main(o, v);
    if (obj && obj.fn) {
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
          if (obj.arg[0] === undefined || obj.arg[1] === undefined) return NaN;
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
          return fixed(Math.log(_main(obj.arg[0])) / Math.log(_main(obj.sub)));
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
        } else if (obj.fn === "list" && obj.arg.length === 2) {
          if (_main(obj.arg[1]) === true) {
            return fixed(_main(obj.arg[0]));
          }
        } else if (obj.fn === "lt" && obj.arg.length === 2) {
          return fixed(_main(obj.arg[0])) < fixed(_main(obj.arg[1]));
        } else if (obj.fn === "gt" && obj.arg.length === 2) {
          return fixed(_main(obj.arg[0])) > fixed(_main(obj.arg[1]));
        } else if (obj.fn === "ge" && obj.arg.length === 2) {
          return fixed(_main(obj.arg[0])) >= fixed(_main(obj.arg[1]));
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
          } else if (
            obj.arg[1].fn === "brace" &&
            obj.arg[1].arg[0] &&
            obj.arg[1].arg[0].fn === "list"
          ) {
            return obj.arg[1].arg[0].arg.some(
              (a) => fixed(_main(a)) === leftValue
            );
          }
        }
      } else if (obj.args) {
        if (obj.fn === "cases") {
          for (let i = 0; i < obj.args.length; i++) {
            const responseComprasion = obj.args[i][0] && _main(obj.args[i][0]);
            if (responseComprasion !== undefined) {
              return responseComprasion;
            }
          }
        }
      } else {
        return NaN;
      }
    } else if (obj && obj.num) {
      if (obj.sup) {
        return fixed(Math.pow(+obj.num, _main(obj.sup)));
      }
      return +obj.num;
    } else if (obj && obj.sym) {
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
      if (value && obj.sup) {
        return fixed(Math.pow(value, _main(obj.sup)));
      }
      return value;
    }
  };
  return main(json, mainVariables);
}