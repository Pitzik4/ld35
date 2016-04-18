import * as Widget from './widget.js';
import * as World from './world.js';

export const canvas = document.getElementById('game');
export const offscreen = document.createElement('canvas');
export const ctx = canvas.getContext('2d', { alpha: false });
export const os = offscreen.getContext('2d', { alpha: true });

let mx = 0, my = 0
export let mouseX = 0, mouseY = 0, mouseDown = false;
window.onmousedown = () => {
  mouseDown = true;
};
window.onmouseup = () => {
  mouseDown = false;
};
window.onmousemove = e => {
  mx = (e.clientX - cx) / scale;
  my = (e.clientY - cy) / scale;
};

const keys = {
  'arrowleft': 37,
  'arrowup': 38,
  'arrowright': 39,
  'arrowdown': 40,
  'a': 37,
  'w': 38,
  'd': 39,
  's': 40,
  '37': 37,
  '38': 38,
  '39': 39,
  '40': 40,
  '65': 37,
  '87': 38,
  '68': 39,
  '83': 40
};
export let leftKey = false, upKey = false, rightKey = false, downKey = false;
window.onkeydown = e => {
  const code = keys[e.key ? e.key.toLowerCase() : e.keyCode];
  switch(code) {
    case 37: leftKey = true; break;
    case 38: upKey = true; break;
    case 39: rightKey = true; break;
    case 40: downKey = true;
  }
};
window.onkeyup = e => {
  const code = keys[e.key ? e.key.toLowerCase() : e.keyCode];
  switch(code) {
    case 37: leftKey = false; break;
    case 38: upKey = false; break;
    case 39: rightKey = false; break;
    case 40: downKey = false;
  }
};

let cw, ch, cx, cy;
export let width, height, scale;

function resize() {
  const par = canvas.parentElement;
  const w = Math.min(par.clientHeight * 1.5, par.clientWidth);
  const h = w / 1.5;
  if(w !== cw || h !== ch) {
    cw = w;
    ch = h;
    offscreen.width = canvas.width = width = Math.ceil(w);
    offscreen.height = canvas.height = height = Math.ceil(h);
    scale = w / 900;
    cx = (par.clientWidth - width) * 0.5;
    cy = (par.clientHeight - height) * 0.5;
    if(w === par.clientWidth) {
      canvas.setAttribute('style', 'width:100%');
    } else {
      canvas.setAttribute('style', 'height:100%');
    }
  }
}

export let time;

export const widget = Widget.create(0, 0, 0);

export let camera = { x: 0, y: 0 };

export const bgColor = '#248';
export const gridSize = 100;

function drawGrid(x, y) {
  ctx.save();
  ctx.beginPath();
  x = Math.floor(x / gridSize) * gridSize;
  y = Math.floor(y / gridSize) * gridSize;
  for(const mx = x + 900; x <= mx; x += gridSize) {
    ctx.moveTo(x, y-gridSize);
    ctx.lineTo(x, y+600+gridSize);
  }
  for(const my = y + 600; y <= my; y += gridSize) {
    ctx.moveTo(x-900-gridSize, y);
    ctx.lineTo(x+gridSize, y);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

export function update(t) {
  requestAnimationFrame(update);
  const dt = (time === undefined) ? (1/60) : ((t - time) * 0.001);
  time = t;
  resize();
  
  mouseX = mx - 450 + camera.x;
  mouseY = my - 300 + camera.y;
  
  widget.update(dt);
  
  ctx.save();
  
  os.save();
  os.setTransform(1, 0, 0, 1, 0, 0);
  os.clearRect(0, 0, width, height);
  os.setTransform(scale, 0, 0, scale, 0, 0);
  os.translate(450 - camera.x, 300 - camera.y);
  World.render(os);
  os.lineWidth = 10;
  os.lineJoin = 'round';
  os.strokeStyle = 'rgba(255,255,255,0.5)';
  os.stroke();
  os.lineWidth = 5;
  os.strokeStyle = bgColor;
  os.globalCompositeOperation = 'destination-out';
  os.stroke();
  os.restore();
  
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(offscreen, 0, 0);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.translate(450 - camera.x, 300 - camera.y);
  
  drawGrid(camera.x - 450, camera.y - 300);
  
  widget.render(ctx);
  
  ctx.restore();
}
