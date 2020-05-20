import Complex from 'Complex'
import fixed from "./fixed";
export default {
  sum(from = 0, to = 0, callback) {
		if(to===Infinity){
			return Infinity;
		}
    let sum = 0;
    for (let i = from; i <= to; i++) {
      sum = fixed(sum + callback(i));
    }
    return sum;
  },
  prod(from = 0, to = 0, callback) {
		if(to===Infinity){
			return Infinity;
		}
    let pr = 1;
    for (let i = from; i <= to; i++) {
      pr = fixed(pr * callback(i));
    }
    return pr;
	},
  prodComplex(from = 0, to = 0, callback) {
		if(to===Infinity){
			return Infinity;
		}
    let pr = Complex.from(1);
    for (let i = from; i <= to; i++) {
			pr.multiply(callback(i))
    }
    return pr;
	},
	pow(x,y){
		return fixed(Math.pow(x,y))
	},
	exp(x){
		return fixed(Math.exp(x))
	},
	cos(x){
		return fixed(Math.cos(x))
	},
	sin(x){
		return fixed(Math.sin(x))
	},

};