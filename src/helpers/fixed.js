export default (number) => {
  if (typeof number === "number") {
    return +number.toFixed(10);
  }
};
