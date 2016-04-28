import { time } from './begin.js';
import { sqr } from './widget.js';

const items = [
  [-4297.1429,-4062.8571,-7611.428599999999,-1091.4286000000002,-5691.428599999999,3251.4286,2834.2857,4668.5714,6377.1428,-62.857142,4640,-4885.7143,-4297.1429,-4062.8571,-897.14286,-1828.5714,-268.57143,-760,-508.57143,788.57143,-2005.7142999999999,548.57143,-2502.8570999999997,1337.1428999999998,-3520,628.57143,-1691.4286,-400,-897.14286,-1828.5714,-533.36055,753.54322,325.28372,779.68731,1043.2101,10.97152,472.75139,-1185.9497,-1664.7314000000001,1105.0763,-832.3657000000002,300.99484999999993,-101.01525000000015,280.7917999999999,220.21324999999985,-202.06112000000007,783.8783699999999,-202.06112000000007,1117.2287,-604.1018300000001,751.5534899999999,-1078.8735000000001,-317.1879,-1078.8735000000001,-1242.4876,40.3754899999999,-1242.4876,1301.0458999999998,-555.5839,1391.9596,-24.243660999999975,979.8173599999999,-101.01525000000015,280.7917999999999],
  [-1474.2858,-1251.4285,-3565.7143,1537.1428,-708.57146,2085.7143,914.2857,988.5714,1679.9999,-28.571428,2148.5714,-1228.5714,-1474.2858,-1251.4285,-2108.5714,-2194.2857,-440,-360,-1445.7143,-651.42857,-2005.7143,548.57143,-2971.4285,2022.8572,-4057.1429,1771.4286,-3428.5715,-605.7142900000001,-2108.5714,-2194.2857,-190.50341,1142.1146,359.56943,1591.1159,346.06724,479.54295,1455.6085,894.0503,-1756.16,2305.0763,-1049.5086000000001,1146.7091000000003,5476.1276,-1616.3510999999996,4311.641799999999,-4019.2039999999997,2829.5926999999992,-4339.204,1117.2286999999992,-604.1018299999996,2191.553499999999,-4301.730599999999,-3291.077000000001,-3551.7268999999987,-7109.453600000001,-1979.9295999999988,-5311.059000000001,3803.903000000001,2758.701799999999,4409.102500000001,6090.0419999999995,-254.4683499999992,5476.1276,-1616.3510999999996]
];

const types = 'mllllllmlllllllmlllmlmllllllllll'.split('');

const goals = [
  [-301, -973,  6271, -71,   637, -1005,    16,   694,  -121,  842,  -1070,   627,  -1310,   590,    967, -307],
  [ 234, 1316,   950, 795,  1238, -1312,  2105, -4369,  -675, -505,  -2108, -2069,   1516, -1299,  -1374, 4173]
];

const gotten = Array(goals[0].length/2);
for(let i = 0, len = goals[0].length/2; i < len; ++i) {
  gotten[i] = false;
}

let position = 0;

export function render(ctx) {
  const fp = Math.floor(position), pos = items[fp%items.length];
  ctx.beginPath();
  if(position === fp) {
    for(let i = 0, len = types.length; i < len; ++i) {
      const x = pos[i*2], y = pos[i*2+1];
      if(types[i] === 'm') {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  } else {
    const pos2 = items[(fp+1)%items.length], factor = position - fp;
    for(let i = 0, len = types.length; i < len; ++i) {
      const x = pos[i*2]*(1-factor) + pos2[i*2]*factor;
      const y = pos[i*2+1]*(1-factor) + pos2[i*2+1]*factor;
      if(types[i] === 'm') {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  }
}

export function renderGoalN(n, ctx) {
  ctx.save();
  const fp = Math.floor(position), factor = position - fp;
  ctx.globalAlpha = factor || gotten[n] ? 0.5 : 1;
  ctx.lineJoin = 'miter';
  ctx.lineWidth = 2.5;
  const g1 = goals[fp%goals.length], g2 = goals[(fp+1)%goals.length];
  const x = g1[n*2]*(1-factor) + g2[n*2]*factor;
  const y = g1[n*2+1]*(1-factor) + g2[n*2+1]*factor;
  ctx.translate(x, y);
  ctx.rotate(time * 0.0005);
  ctx.strokeRect(-15, -15, 30, 30);
  ctx.restore();
}

export function renderGoals(ctx) {
  for(let i = 0, len = gotten.length; i < len; ++i) {
    renderGoalN(i, ctx);
  }
}

export function gotGoal(x, y) {
  if(Math.floor(position) !== position) return false;
  for(let i = 0, len = gotten.length; i < len; ++i) {
    const xp = goals[position%goals.length][i*2];
    const yp = goals[position%goals.length][i*2+1];
    if((sqr(xp-x)+sqr(yp-y)) < 5000) {
      gotten[i] = true;
      return true;
    }
  }
  return false;
}

export function update(dt) {
  const f = Math.floor(position);
  if(f !== position) {
    position += dt * 0.1;
    const f2 = Math.floor(position);
    if(f2 !== f) position = f2;
  }
}

export function shapeshift() {
  position += 0.001;
}
