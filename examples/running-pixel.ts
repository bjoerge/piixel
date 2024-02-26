import ws281x, {StripType} from '../src'

const leds = 16

// Current pixel position
let offset = 0

// Configure ws281x
ws281x.configure({leds, gpio: 18, type: StripType.WS2811_STRIP_GRB, brightness: 0.2})
// Create a fill color with red/green/blue.
let color = 0
function loop() {
  const pixels = new Uint32Array(leds)

  // Set a specific pixel
  pixels[offset] = colorwheel(color++ % 255)

  // Move on to next
  offset = (offset + 1) % leds

  // Render to strip
  ws281x.render(pixels)
}

setInterval(loop, 100)

/**
 * Ported to JS from
 * https://github.com/adafruit/circuitpython/blob/main/shared-module/rainbowio/__init__.c
 * @param pos
 */
function colorwheel(pos: number) {
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
