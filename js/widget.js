import { mouseX, mouseY, mouseDown, leftKey, upKey, rightKey, downKey, camera } from './begin.js';
import * as World from './world.js';

const points = Array(48);
for(let a = 0, i = 0; i < 48; i += 8) {
  a += Math.PI / 12;
  let next = a + Math.PI / 12;
  points[i] = Math.cos(a) * 105;
  points[i+1] = Math.sin(a) * 105;
  points[i+2] = Math.cos(next) * 100;
  points[i+3] = Math.sin(next) * 100;
  a = next + Math.PI / 12;
  next = a + Math.PI / 12;
  points[i+4] = Math.cos(a) * 75;
  points[i+5] = Math.sin(a) * 75;
  points[i+6] = Math.cos(next) * 100;
  points[i+7] = Math.sin(next) * 100;
  a = next;
}

export function create(x, y, rot) {
  let velX = 0, velY = 0, velRot = 0.2, rsign = 1;
  
  function render(ctx) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(0.5, 0.5);
    ctx.beginPath();
    ctx.moveTo(100, 0);
    for(let i = 0; i < 48; i += 4) {
      ctx.quadraticCurveTo(points[i], points[i+1], points[i+2], points[i+3]);
    }
    ctx.closePath();
    ctx.moveTo(65, 0);
    ctx.arc(0, 0, 65, 0, Math.PI*2, true);
    ctx.globalAlpha = 1;
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }
  
  function nearest() {
    let position = { x: x, y: y }, nearestPoint = position, dsq = Number.MAX_VALUE;
    let cur = { x: 0, y: 0 };
    World.render({
      beginPath() {  },
      moveTo(x, y) {
        cur = { x: x, y: y };
      },
      lineTo(x, y) {
        const next = { x: x, y: y };
        const p = nearestOnSegment(position, cur, next);
        cur = next;
        const di = dist2(position, p);
        if(di < dsq) {
          dsq = di;
          nearestPoint = p;
        }
      }
    });
    return nearestPoint;
  }
  
  function update(dt) {
    let dx, dy;
    if(mouseDown) {
      dx = mouseX - x;
      dy = mouseY - y;
    } else {
      dx = dy = 0;
      if(leftKey) dx -= 200;
      if(rightKey) dx += 200;
      if(upKey) dy -= 200;
      if(downKey) dy += 200;
    }
    const dsq = dx * dx + dy * dy;
    if(dsq > 40000) {
      const d = Math.sqrt(dsq) * 0.005;
      dx /= d;
      dy /= d;
    }
    velX += (dx = dx - velX) * (1 - Math.pow(0.25, dt));
    velY += (dy = dy - velY) * (1 - Math.pow(0.25, dt));
    const dr = Math.max(0.2, (Math.sqrt(velX*velX+velY*velY)+Math.sqrt(dx*dx+dy*dy))*0.01)*rsign;
    velRot += (dr - velRot) * (1 - Math.pow(0.25, dt));
    
    x += velX * dt;
    y += velY * dt;
    rot += velRot * dt;
    
    camera.x += (x - camera.x) * (1 - Math.pow(0.25, dt));
    camera.y += (y - camera.y) * (1 - Math.pow(0.25, dt));
  }
  
  return Object.freeze({
    render,
    update
  });
}

// http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment/1501725#1501725
function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function nearestOnSegment(p, v, w) { // point, segment vw
  const l2 = dist2(v, w);
  if (l2 === 0) return v;
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return { x: v.x + t * (w.x - v.x),
           y: v.y + t * (w.y - v.y) };
}
