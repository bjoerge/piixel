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

const pixels = new Uint32Array(LEDS)
for (let i = 0; i < LEDS; i++) {
  pixels[i] = colorwheel((i * LEDS) % 255)
}

const MAX_BRIGHTNESS = 1
const MIN_BRIGHTNESS = 0.2

// loop with brightness as an integer between 0 and 100
let brightness = MIN_BRIGHTNESS * 100
let direction = 1

ws281x.render({pixels, brightness: brightness * 0.01})

function loop() {
  if (brightness === MAX_BRIGHTNESS * 100) {
    direction = -1
  }
  if (brightness === MIN_BRIGHTNESS * 100) {
    direction = 1
  }
  brightness += direction
  ws281x.render({brightness: brightness * 0.01})
}

setInterval(loop, 16)
