const items = [
  [-897.14286,-1828.5714,-268.57143,-760,-508.57143,788.57143,-2005.7142999999999,548.57143,-2502.8570999999997,1337.1428999999998,-3520,628.57143,-1691.4286,-400,-897.14286,-1828.5714,-533.36055,753.54322,325.28372,779.68731,1043.2101,10.97152,472.75139,-1185.9497,-1664.7314000000001,1105.0763,-832.3657000000002,300.99484999999993,-101.01525000000015,280.7917999999999,220.21324999999985,-202.06112000000007,783.8783699999999,-202.06112000000007,1117.2287,-604.1018300000001,751.5534899999999,-1078.8735000000001,-317.1879,-1078.8735000000001,-1242.4876,40.3754899999999,-1242.4876,1301.0458999999998,-555.5839,1391.9596,-24.243660999999975,979.8173599999999,-101.01525000000015,280.7917999999999]
];

const types = 'mlllllllmlllmlmllllllllll';

let position = 0;

export function render(ctx) {
  const fp = Math.floor(position), pos = items[fp%items.length];
  ctx.beginPath();
  if(position === fp) {
    for(let i = 0, len = types.length; i < len; ++i) {
      const x = pos[i*2], y = pos[i*2+1];
      if(types.charAt(i) === 'm') {
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
      if(types.charAt(i) === 'm') {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  }
}

export function update(dt) {
  //position += dt * 0.25;
}
