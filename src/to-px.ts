// @ts-nocheck
import parseUnit from './parse-unit';

const PIXELS_PER_INCH = 96;

const defaults = {
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

function toPX(str: string | number | keyof typeof defaults) {
  if (!str && str !== 0) return null;

  if (str in defaults) return defaults[str];

  // detect number of units
  const [num, unit] = parseUnit(str);
  if (!isNaN(num)) {
    if (unit) {
      const px = toPX(unit);
      return typeof px === 'number' ? num * px : null;
    } else {
      return num;
    }
  }

  return null;
}

export default toPX;
