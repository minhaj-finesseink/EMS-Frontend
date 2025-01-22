// src/utils/adjustDarkColor.js

export function adjustDarkness(color) {
    let hex = color;
    if (hex.indexOf('rgb') !== -1) {
      // Convert rgb to hex (if needed)
      hex = rgbToHex(color);
    }
  
    // Convert HEX to HSL
    let hsl = hexToHSL(hex);
  
    // Darken the color (adjust the lightness)
    hsl.l = Math.max(hsl.l - 20, 0); // Darken by 20%
  
    // Convert back to HEX
    return HSLToHex(hsl);
  }
  
  // Function to convert HEX to HSL
  function hexToHSL(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
  
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
  
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  
  // Function to convert HSL to HEX
  function HSLToHex(hsl) {
    let { h, s, l } = hsl;
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r, g, b;
  
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
    } else {
      r = c;
      g = 0;
      b = x;
    }
  
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
  
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }
  
  // Function to convert RGB to HEX
  function rgbToHex(rgb) {
    let rgbArr = rgb.match(/\d+/g);
    return `#${((1 << 24) | (parseInt(rgbArr[0]) << 16) | (parseInt(rgbArr[1]) << 8) | parseInt(rgbArr[2])).toString(16).slice(1)}`;
  }  