import mouseChange from './mouse-change';
import mouseWheel from './mouse-wheel';
import { lookAt, perspective, identity } from './mat4';
import { SetupCamera, mat4, vec3 } from './type';
import type REGL from 'regl';
import { clamp, getHeight, getWidth } from './utils';
const isBrowser = typeof window !== 'undefined';
type IProps = {
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

const getDefaultProp = (props: Partial<IProps>) => {
  const defaultCameraState: IProps = {
    view: identity(new Float32Array(16)),
    projection: identity(new Float32Array(16)),
    center: [0, 0, 0],
    theta: 0,
    phi: 0,
    distance: Math.log(props.distance || 10.0),
    eye: new Float32Array(16),
    up: new Float32Array(props.up || [0, 1, 0]),
    fovy: props.fovy || Math.PI / 4.0,
    near: typeof props.near !== 'undefined' ? props.near : 0.01,
    far: typeof props.far !== 'undefined' ? props.far : 1000.0,
    noScroll: typeof props.noScroll !== 'undefined' ? props.noScroll : false,
    flipY: !!props.flipY,
    dtheta: 0,
    dphi: 0,
    rotationSpeed:
      typeof props.rotationSpeed !== 'undefined' ? props.rotationSpeed : 1,
    zoomSpeed: typeof props.zoomSpeed !== 'undefined' ? props.zoomSpeed : 1,
    renderOnDirty:
      typeof props.renderOnDirty !== undefined ? !!props.renderOnDirty : false,
    dirty: false,
    damping: 0.9,
    minDistance: 0.1,
    maxDistance: 1000,
    mouse: true,
  };

  return defaultCameraState;
};

function createCamera(regl: REGL.Regl, props_: Partial<IProps>) {
  const props = props_ || {};

  const cameraState = getDefaultProp(props);
  const { element, damping } = cameraState;
  const right = new Float32Array([1, 0, 0]);
  const front = new Float32Array([0, 0, 1]);

  const minDistance = Math.log(
    'minDistance' in cameraState ? cameraState.minDistance : 0.1
  );
  const maxDistance = Math.log(
    'maxDistance' in cameraState ? cameraState.maxDistance : 1000
  );

  let ddistance = 0;

  let prevX = 0;
  let prevY = 0;

  if (isBrowser && props.mouse !== false) {
    const source: HTMLElement = element || (regl._gl.canvas as HTMLElement);

    mouseChange(source, function (buttons, x, y) {
      if (buttons & 1) {
        var dx = (x - prevX) / getWidth(element);
        var dy = (y - prevY) / getHeight(element);

        cameraState.dtheta += cameraState.rotationSpeed * 4.0 * dx;
        cameraState.dphi += cameraState.rotationSpeed * 4.0 * dy;
        cameraState.dirty = true;
      }
      prevX = x;
      prevY = y;
    });

    mouseWheel(
      source,
      function ({ dy }) {
        ddistance += (dy / getHeight(element)) * cameraState.zoomSpeed;
        cameraState.dirty = true;
      },
      cameraState.noScroll
    );
  }

  const damp = (x: number) => {
    var xd = x * damping;
    if (Math.abs(xd) < 0.1) {
      return 0;
    }
    cameraState.dirty = true;
    return xd;
  };

  const updateCamera = (props: IProps) => {
    Object.assign(cameraState, props);
    const { center, eye, up, dtheta, dphi } = cameraState;
    cameraState.theta += dtheta;
    cameraState.phi = clamp(
      cameraState.phi + dphi,
      -Math.PI / 2.0,
      Math.PI / 2.0
    );
    cameraState.distance = clamp(
      cameraState.distance + ddistance,
      minDistance,
      maxDistance
    );

    cameraState.dtheta = damp(dtheta);
    cameraState.dphi = damp(dphi);
    ddistance = damp(ddistance);

    var theta = cameraState.theta;
    var phi = cameraState.phi;
    var r = Math.exp(cameraState.distance);

    var vf = r * Math.sin(theta) * Math.cos(phi);
    var vr = r * Math.cos(theta) * Math.cos(phi);
    var vu = r * Math.sin(phi);

    for (var i = 0; i < 3; ++i) {
      eye[i] = center[i] + vf * front[i] + vr * right[i] + vu * up[i];
    }
    lookAt(cameraState.view, eye, center, up);
  };

  cameraState.dirty = true;

  const injectContext = regl({
    context: Object.assign({}, cameraState, {
      dirty: function () {
        return cameraState.dirty;
      },
      projection: function (context: REGL.DefaultContext) {
        perspective(
          cameraState.projection,
          cameraState.fovy,
          context.viewportWidth / context.viewportHeight,
          cameraState.near,
          cameraState.far
        );
        if (cameraState.flipY) {
          cameraState.projection[5] *= -1;
        }
        return cameraState.projection;
      },
    }),
    //     context<Context extends REGL.DefaultContext, K extends keyof Context>(name: K): DynamicVariable<Context[K]>;
    uniforms: Object.keys(cameraState).reduce(function (
      uniforms,
      name: string
    ) {
      uniforms[name] = regl.context(name as any);
      return uniforms;
    },
    {} as Record<string, any>),
  });

  const setupCamera: SetupCamera = (props, block) => {
    if (typeof setupCamera.dirty !== 'undefined') {
      cameraState.dirty = setupCamera.dirty || cameraState.dirty;
      setupCamera.dirty = undefined;
    }

    if (props && block) {
      cameraState.dirty = true;
    }

    if (cameraState.renderOnDirty && !cameraState.dirty) return;

    if (!block) {
      block = props;
      props = {};
    }

    updateCamera(props);
    injectContext(block);
    cameraState.dirty = false;
  };

  Object.assign(setupCamera, cameraState);
  return setupCamera;
}
export default createCamera;
