/**
 * @public
 * Returns the colorwheel RGB value as an integer/hex value for the given number
 *
 * Based on C implementation from {@Link https://github.com/adafruit/circuitpython/blob/main/shared-module/rainbowio/__init__.c}
 * @param pos - a number between 0 and 255
 *
 */
export function colorwheel(pos: number) {
  pos = pos - Math.floor(pos / 256) * 256
  let shift1, shift2
  if (pos < 85) {
    shift1 = 8
    shift2 = 16
  } else if (pos < 170) {
    pos -= 85
    shift1 = 0
    shift2 = 8
  } else {
    pos -= 170
    shift1 = 16
    shift2 = 0
  }
  let p = Math.floor(pos * 3)
  p = p < 256 ? p : 255
  return (p << shift1) | ((255 - p) << shift2)
}
