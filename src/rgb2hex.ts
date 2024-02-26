/**
 * @public
 * Convert RGB color (e.g. 255, 255, 255) to HEX number
 * @param r - red (0-255)
 * @param g - green (0-255)
 * @param b - blue (0-255)
 */
export function rgb2hex(r: number, g: number, b: number) {
  return (r << 16) | (g << 8) | b
}
