import ws281x, {StripType} from '../src'

const leds = 16

ws281x.configure({
  gpio: 18,
  leds,
  brightness: 0.2,
  type: StripType.WS2811_STRIP_GRB,
})

// Create a pixel array matching the number of leds.
// This must be an instance of Uint32Array.
const pixels = new Uint32Array(leds)

// Create a fill color with red/green/blue.
const [r, g, b] = [255, 0, 0]

const color = (r << 16) | (g << 8) | b

for (let i = 0; i < leds; i++) {
  pixels[i] = color
}

// Render to strip
ws281x.render(pixels)
