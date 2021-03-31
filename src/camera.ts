import mouseChange from './mouse-change';
import mouseWheel from './mouse-wheel';
import { lookAt, perspective, identity } from './mat4';
import { SetupCamera, IProps } from './type';
import type REGL from 'regl';
import { clamp, getHeight, getWidth } from './utils';
const isBrowser = typeof window !== 'undefined';

const getDefaultProp = (props: Partial<IProps>) => {
  const defaultCameraState: IProps = {
    view: identity(new Float32Array(16)),
    projection: identity(new Float32Array(16)),
    center: props.center || [0, 0, 0],
    theta: props.theta ?? 0,
    phi: props.phi ?? 0,
    distance: Math.log(props.distance ?? 10.0),
    eye: new Float32Array(16),
    up: new Float32Array(props.up || [0, 1, 0]),
    fovy: props.fovy ?? Math.PI / 4.0,
    near: props.near ?? 0.01,
    far: props.far ?? 1000.0,
    noScroll: props.noScroll ?? false,
    flipY: props.flipY ?? false,
    dtheta: props.dtheta ?? 0,
    dphi: props.dphi ?? 0,
    rotationSpeed: props.rotationSpeed ?? 1,
    zoomSpeed: props.zoomSpeed ?? 1,
    renderOnDirty: props.renderOnDirty ?? false,
    damping: props.damping ?? 0.9,
    minDistance: Math.log(props.minDistance ?? 0.1),
    maxDistance: Math.log(props.maxDistance ?? 1000),
    mouse: props.mouse ?? true,
    dirty: false,
  };

  return defaultCameraState;
};
const right = new Float32Array([1, 0, 0]);
const front = new Float32Array([0, 0, 1]);

function createCamera(regl: REGL.Regl, props: Partial<IProps> = {}) {
  const cameraState = getDefaultProp(props);
  const { element, damping, minDistance, maxDistance } = cameraState;
  let ddistance = 0;
  let prevX = 0;
  let prevY = 0;
  if (isBrowser && props.mouse !== false) {
    const source: HTMLElement = element || (regl._gl.canvas as HTMLElement);
    mouseChange(source, function (buttons, x, y) {
      if (buttons & 1) {
        const dx = (x - prevX) / getWidth(element);
        const dy = (y - prevY) / getHeight(element);
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
    const xd = x * damping;
    if (Math.abs(xd) < 0.1) {
      return 0;
    }
    cameraState.dirty = true;
    return xd;
  };

  const updateCamera = (props: Partial<IProps> = {}) => {
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

    const theta = cameraState.theta;
    const phi = cameraState.phi;
    const r = Math.exp(cameraState.distance);

    const vf = r * Math.sin(theta) * Math.cos(phi);
    const vr = r * Math.cos(theta) * Math.cos(phi);
    const vu = r * Math.sin(phi);

    for (let i = 0; i < 3; ++i) {
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
    uniforms: Object.keys(cameraState).reduce(function (
      uniforms,
      name: string
    ) {
      uniforms[name] = regl.context(name as any);
      return uniforms;
    },
    {} as Record<string, any>),
  });

  const setupCamera: SetupCamera = function (
    props: Partial<IProps> = {},
    block: any = undefined
  ) {
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
    }
    updateCamera(props);
    injectContext(block);
    cameraState.dirty = false;
  };

  Object.assign(setupCamera, cameraState);
  return setupCamera;
}
export default createCamera;
