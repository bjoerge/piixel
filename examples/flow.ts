import {colorwheel, StripType, ws281x} from 'piixel'

const LEDS = 16

// Configure ws281x
ws281x.configure({
  // use SPI
  gpio: 10,
  leds: LEDS,
  type: StripType.WS2811_STRIP_GRB,
  resetOnExit: true,
})

// Current pixel position
let offset = 0

function loop() {
  const pixels = new Uint32Array(LEDS)
  offset++

  for (let i = 0; i < LEDS; i++) {
    // Set the color at the current offset
    pixels[i] = colorwheel((i * LEDS + offset) % 255)
  }

  ws281x.render(pixels)
}

setInterval(loop, 16)
