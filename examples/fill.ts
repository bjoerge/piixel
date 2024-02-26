import {colorwheel, StripType, ws281x} from 'piixel'

const LEDS = 16

ws281x.configure({
  gpio: 18,
  leds: LEDS,
  brightness: 0.2,
  type: StripType.WS2811_STRIP_GRB,
})

const pixels = new Uint32Array(LEDS)
for (let i = 0; i < LEDS; i++) {
  pixels[i] = colorwheel((i * 256) / LEDS)
}

ws281x.render(pixels)
