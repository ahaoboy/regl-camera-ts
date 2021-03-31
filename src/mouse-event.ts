const mouseButtons = (ev: MouseEvent | Event) => {
  if (typeof ev === 'object') {
    if ('buttons' in ev) {
      return ev.buttons;
    }
  }
  return 0;
};

const mouseElement = (ev: MouseEvent | Event) => {
  return ev.target || ev.srcElement || window;
};

const mouseRelativeX = (ev: MouseEvent | Event) => {
  if (typeof ev === 'object') {
    if ('offsetX' in ev) {
      return ev.offsetX;
    }
  }
  return 0;
};

function mouseRelativeY(ev: MouseEvent | Event) {
  if (typeof ev === 'object') {
    if ('offsetY' in ev) {
      return ev.offsetY;
    }
  }
  return 0;
}
export default {
  x: mouseRelativeX,
  y: mouseRelativeY,
  element: mouseElement,
  buttons: mouseButtons,
};
