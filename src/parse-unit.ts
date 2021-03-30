const parseUnit = (str: string): [number, string] => {
  str = String(str);
  const num = parseFloat(str);
  const unit = str.match(/[\d.\-\+]*\s*(.*)/)?.[1] || '';
  return [num, unit];
};
export default parseUnit;
