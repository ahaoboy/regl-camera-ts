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
    // var target = <HTMLElement>mouseElement(ev);
    // var bounds = target.getBoundingClientRect();
    // return ev.clientX - bounds.left;
  }
  return 0;
};

function mouseRelativeY(ev: MouseEvent | Event) {
  if (typeof ev === 'object') {
    if ('offsetY' in ev) {
      return ev.offsetY;
    }
    // var target = <HTMLElement>mouseElement(ev);
    // var bounds = target.getBoundingClientRect();
    // return ev.clientY - bounds.top;
  }
  return 0;
}
export default {
  x: mouseRelativeX,
  y: mouseRelativeY,
  element: mouseElement,
  buttons: mouseButtons,
};
