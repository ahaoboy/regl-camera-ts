export const clamp = (x: number, lo: number, hi: number) => {
  return Math.min(Math.max(x, lo), hi);
};
export const getWidth = (element: HTMLElement | null | undefined) => {
  return element ? element.offsetWidth : window.innerWidth;
};

export const getHeight = (element: HTMLElement | null | undefined) => {
  return element ? element.offsetHeight : window.innerHeight;
};
