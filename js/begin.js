import * as Widget from './widget.js';
import * as World from './world.js';

export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d', { alpha: false });

let mx = 0, my = 0
export let mouseX = 0, mouseY = 0, mouseDown = false;
function moveMouse(item) {
  mx = (item.clientX - cx) * dpr / scale;
  my = (item.clientY - cy) * dpr / scale;
}
window.onmousedown = e => {
  if(!e.button) {
    mouseDown = true;
    moveMouse(e);
  }
};
window.onmouseup = e => {
  if(!e.button) {
    mouseDown = false;
  }
};
window.onmousemove = e => {
  moveMouse(e);
};
window.ontouchstart = e => {
  if(e.targetTouches.length) {
    mouseDown = true;
    moveMouse(e.targetTouches[0]);
  }
};
window.ontouchend = e => {
  if(!e.targetTouches.length) {
    mouseDown = false;
  }
};
window.ontouchmove = e => {
  if(e.targetTouches.length) {
    moveMouse(e.targetTouches[0]);
  }
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
export let width, height, scale, dpr;

function resize() {
  const par = canvas.parentElement;
  const w = Math.min(par.clientHeight * 1.5, par.clientWidth);
  const h = w / 1.5;
  if(w !== cw || h !== ch) {
    cw = w;
    ch = h;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width = Math.ceil(w * dpr);
    canvas.height = height = Math.ceil(h * dpr);
    scale = width / 900;
    cx = (par.clientWidth - width/dpr) * 0.5;
    cy = (par.clientHeight - height/dpr) * 0.5;
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

export const bgColor = '#248', color = '#fff';
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
  ctx.globalAlpha = 0.25;
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
  World.update(dt);
  
  ctx.save();
  
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.translate(450 - camera.x, 300 - camera.y);
  ctx.strokeStyle = color;
  
  World.render(ctx);
  ctx.lineWidth = 10;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.strokeStyle = bgColor;
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.strokeStyle = color;
  
  widget.render(ctx);
  
  drawGrid(camera.x - 450, camera.y - 300);
  
  ctx.restore();
}
