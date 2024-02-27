import {colorwheel, StripType, ws281x} from 'piixel'

const LEDS = 16

// Configure ws281x
ws281x.configure({
  gpio: 10,
  leds: LEDS,
  type: StripType.WS2811_STRIP_GRB,
  resetOnExit: true,
})

let offset = 0

function loop() {
  const pixels = new Uint32Array(LEDS)
  // Set the color at the current offset
  pixels[offset % LEDS] = colorwheel(offset % 255)

  offset++

  ws281x.render(pixels)
}

setInterval(loop, 100)
