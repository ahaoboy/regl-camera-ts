export type IProps = {
  view: mat4;
  projection: mat4;
  center: vec3;
  theta: number;
  phi: number;
  distance: number;
  eye: mat4;
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

  (props: any, block: any): void;
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
