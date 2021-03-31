## BETA
fork from [regl-camera](https://github.com/regl-project/regl-camera)

## doc
```
yarn add regl-camera-ts

import createCamera from "regl-camera-ts";

const camera = createCamera(regl, {
    center: [0, 0, 0],
    theta: Math.PI / 2,
});

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1],
  });
  camera(() => {
    drawCommand();
  });
});
```