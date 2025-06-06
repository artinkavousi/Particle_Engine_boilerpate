import { initWebGPU } from '@webgpu/core';

const canvas = document.getElementById('c') as HTMLCanvasElement;
initWebGPU(canvas).then(({ device }) => {
  console.log('GPU device ready', device);
});
