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
};
