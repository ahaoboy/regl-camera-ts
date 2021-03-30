import toPX from './to-px';

const mouseWheelListen = (
  element: HTMLElement,
  callback: (state: { dx: number; dy: number; dz: number }) => void,
  noScroll: boolean
) => {
  const lineHeight = toPX('ex') || 0;
  const listener = (ev: WheelEvent) => {
    if (noScroll) {
      ev.preventDefault();
    }
    let dx = ev.deltaX || 0;
    let dy = ev.deltaY || 0;
    let dz = ev.deltaZ || 0;
    let mode = ev.deltaMode;
    let scale = 1;
    switch (mode) {
      case 1:
        scale = lineHeight;
        break;
      case 2:
        scale = window.innerHeight;
        break;
    }
    dx *= scale;
    dy *= scale;
    dz *= scale;
    if (dx || dy || dz) {
      callback({ dx, dy, dz });
    }
  };
  element.addEventListener('wheel', listener);
  return listener;
};
export default mouseWheelListen;
