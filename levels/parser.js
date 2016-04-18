function parse(path) {
  path = path.trim();
  var types = '', items = [];
  var x = 0, y = 0;
  var sx = 0, sy = 0;
  var type, relative;
  while(path.length) {
    while(path.length && /\s/.test(path.charAt(0))) {
      path = path.substr(1);
    }
    if(path.length && /[mlz]/i.test(path.charAt(0))) {
      type = path.charAt(0);
      relative = (type === type.toLowerCase());
      type = type.toLowerCase();
      if(type === 'z') {
        types += 'l';
        items.push(sx, sy);
        x = sx; y = sy;
      }
      path = path.substr(1);
      continue;
    }
    let end = path.indexOf(',');
    if(end <= 0) {
      continue;
    }
    let newX = parseFloat(path.substr(0, end));
    path = path.substr(end+1);
    end = Math.min(path.indexOf(' ') >>> 0, path.length);
    let newY = parseFloat(path.substr(0, end));
    path = path.substr(end);
    if(relative) {
      newX += x; newY += y;
    }
    if(type === 'm') {
      types += 'm';
      sx = x = newX; sy = y = newY;
      items.push(x, y);
      type = 'l';
    } else if(type === 'l') {
      types += 'l';
      x = newX; y = newY;
      items.push(x, y);
    } else throw Error(type);
  }
  return { types: types, items: JSON.stringify(items) };
}