import ws281x, {StripType} from '../src'

const leds = 16

ws281x.configure({
  gpio: 18,
  leds,
  brightness: 1,
})

// Create a pixel array matching the number of leds.
// This must be an instance of Uint32Array.
const pixels = new Uint32Array(leds)

// Create a fill color with red/green/blue.
const red = 255,
  green = 0,
  blue = 0

const color = (red << 16) | (green << 8) | blue

for (let i = 0; i < leds; i++) {
  pixels[i] = color
}

// Render to strip
ws281x.render(pixels)
