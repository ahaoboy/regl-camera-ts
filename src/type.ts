import type Regl from 'regl';

export type IProps = {
  view: mat4;
  projection: mat4;
  center: vec3;
  theta: number;
  phi: number;
  distance: number;
  eye: vec3;
  up: vec3;
  fovy: number;
  near: number;
  far: number;
  noScroll: boolean;
  flipY: boolean;
  dtheta: number;
  dphi: number;
  rotationSpeed: number;
  zoomSpeed: number;
  renderOnDirty: boolean;
  dirty: boolean;
  damping: number;
  minDistance: number;
  maxDistance: number;
  mouse: boolean;
  element?: HTMLElement;
};
export interface SetupCamera {
  dirty?: boolean | undefined;
  cameraState: IProps;
  (
    props?: (state: {
      tick: number;
      time: number;
      viewportHeight: number;
      viewportWidth: number;
      framebufferHeight: number;
      framebufferWidth: number;
      drawingBufferHeight: number;
      drawingBufferWidth: number;
      dirty: boolean | undefined;
      pixelRatio: number;
    }) => void | Regl.DrawCommand | IProps,
    block?: any
  ): void;
}
export type vec3 = [number, number, number] | Float32Array;
export type mat4 =
  | Float32Array
  | [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ];
