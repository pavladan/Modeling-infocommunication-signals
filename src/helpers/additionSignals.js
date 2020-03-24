export default signals => {
  const resSignal = [];
  const firstSignalX = signals[0].map(s => s.x);
  for (let i = 0; i < firstSignalX.length - 1; i++) {
    const x = firstSignalX[i];
    const arrY = [];
    signals.forEach(s => {
			const curX = s.find(s=>s.x === x);
      curX && arrY.push(curX.y);
    });
    const y = arrY.reduce((acc, y) => acc + y);
    resSignal.push({ x, y });
  }
  return resSignal;
};
