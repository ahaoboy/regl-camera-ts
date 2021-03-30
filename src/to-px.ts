import parseUnit from './parse-unit';
const PIXELS_PER_INCH = 96;
const defaultsPX: Record<string, number> = {
  ch: 8,
  ex: 7.15625,
  em: 16,
  rem: 16,
  in: PIXELS_PER_INCH,
  cm: PIXELS_PER_INCH / 2.54,
  mm: PIXELS_PER_INCH / 25.4,
  pt: PIXELS_PER_INCH / 72,
  pc: PIXELS_PER_INCH / 6,
  px: 1,
};
const toPX = (str: string) => {
  if (!str) return null;
  // detect number of units
  const [num, unit] = parseUnit(str);
  if (isNaN(num)) {
    return null;
  }
  if (unit) {
    const px = defaultsPX[unit];
    return typeof px === 'number' ? num * px : null;
  }
  return num;
};

export default toPX;
