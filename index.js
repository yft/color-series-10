function rangeLimit(num) {
  return Math.min(255, Math.max(0, num));
}
function checkRgb(hex) {
  return /^[#a-f\d]{6,7}$/.test(hex);
}
function formatRgb(hex) {
  return hex[0] === '#' ? hex.slice(1) : hex;
}

// region hsv color 取 h s v 值
function getHue(h, i, isLight) {
  let hueStep = 2;
  let hue = h + (isLight ? -1 : 1) * i * hueStep;
  if (hue < 0) {
    hue += 360;
  } else if (hue > 360) {
    hue -= 360;
  }
  return hue;
}

function getSaturation(s, i, isLight) {
  let saturationStep = 16;
  let saturationStep2 = 5;
  let saturation = s * 100;

  saturation = saturation + (isLight ? -saturationStep : saturationStep2) * i;

  saturation = Math.min(saturation, 100);
  saturation = Math.max(saturation, 8);

  return saturation / 100;
}

function getValue(v, i, isLight) {
  let brightnessStep = 5;
  let brightnessStep2 = 15;
  let value = v * 100;
  value = isLight ? value + brightnessStep * i : value - brightnessStep2 * i;
  value = Math.min(value, 100);
  return Math.abs(value) / 100;
}
// endregion

// region hex color 取 r g b 值
function getRed(hex) {
  return _rgbBase(hex, 0, 2);
}

function getGreen(hex) {
  return _rgbBase(hex, 2, 4);
}

function getBlue(hex) {
  return _rgbBase(hex, 4, 6);
}

function _rgbBase(hex, start, end) {
  return parseInt(hex.slice(start, end), 16);
}
// endregion

// region rgb hsv 格式互转
function rgb2hsv(r, g, b) {
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let diff = max - min;
  let h = 0, s = 0, v = max / 255;
  if (diff !== 0) {
    if (max === r) {
      h = 60 * ((g - b) / diff + (g < b ? 6 : 0));
    } else if (max === g) {
      h = 60 * ((b - r) / diff + 2);
    } else if (max === b) {
      h = 60 * ((r - g) / diff + 4);
    }
  }

  if (max !== 0) {
    s = diff / max;
  }

  return {
    h: Math.abs(h),
    s: Math.abs(s),
    v: Math.abs(v)
  };
}

function hsv2rgb(h, s, v) {
  let c = v * s;
  let x = c * (1 - Math.abs(h / 60 % 2 - 1));
  let m = v - c;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  return {
    r: (r + m) * 255,
    g: (g + m) * 255,
    b: (b + m) * 255
  };
}
// endregion

// 数值转rgb颜色格式
function rgb(r, g, b) {
  r = rangeLimit(r);
  g = rangeLimit(g);
  b = rangeLimit(b);
  let [o, p, q] = [r, g, b].map(item => Math.round(item).toString(16)).map(item => {
    return item.length < 2 ? '0' + item : item;
  });
  return '#' + o + p + q;
}

export function genColor(hex, index) {
  if (index < 1 || index > 10 || !checkRgb(hex)) {
    return '';
  }
  hex = formatRgb(hex);
  let masterIndex = 6;
  let isLight = index < masterIndex;
  let r = getRed(hex);
  let g = getGreen(hex);
  let b = getBlue(hex);
  let i = isLight ? masterIndex - index : index - masterIndex;
  let hsv = rgb2hsv(r, g, b);
  let h = getHue(hsv.h, i, isLight);
  let s = getSaturation(hsv.s, i, isLight);
  let v = getValue(hsv.v, i, isLight);
  let rgb10 = hsv2rgb(h, s, v);

  return rgb(rgb10.r, rgb10.g, rgb10.b);
}

export function colorPalette(hex) {
  let palette = [];
  for (let i = 1; i <= 10; i++) {
    palette.push(genColor(hex, i));
  }
  return palette;
}
