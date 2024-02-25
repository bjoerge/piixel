import {alternatingMatrixMapping} from "../src/mappings"

import ws281x from "../src"

const panel = {
  width: 4,
  height: 4,
}

const leds = panel.width * panel.height

// Configure ws281x
ws281x.configure({leds, gpio: 18, brightness: 0.4})

// Current pixel position
let offset = 0

const mapping = alternatingMatrixMapping(panel)

function loop() {
  const pixels = new Uint32Array(leds)

  // Set a specific pixel
  pixels[offset] = 0xff00aa

  // Move on to next
  offset = (offset + 1) % leds

  // Render to strip
  ws281x.render(pixels, mapping)
  // ws281x.sleep(1000 / 10)
  setTimeout(loop, 50)
}
loop()
