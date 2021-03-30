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
