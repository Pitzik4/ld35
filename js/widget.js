import { mouseX, mouseY, mouseDown, leftKey, upKey, rightKey, downKey, camera } from './begin.js';

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
  let velX = 0, velY = 0, velRot = 0.2;
  
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
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }
  
  function update(dt) {
    let dx, dy;
    if(mouseDown) {
      dx = (mouseX - x);
      dy = (mouseY - y);
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
    const dr = Math.max(0.2, (Math.sqrt(velX*velX+velY*velY)+Math.sqrt(dx*dx+dy*dy))*0.01);
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
