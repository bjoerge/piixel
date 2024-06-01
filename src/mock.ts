import ansiEscapes from 'ansi-escapes'
import chalk from 'chalk'

import {Bindings} from './bindings'
import {Ws281xConfig} from './ws281x'

function brighten(
  color: [r: number, g: number, b: number],
  amount: number,
): [number, number, number] {
  amount = amount === 0 ? 0 : amount
  const [r, g, b] = color
  return [
    Math.max(0, Math.min(255, r - Math.round(255 * -amount))),
    Math.max(0, Math.min(255, g - Math.round(255 * -amount))),
    Math.max(0, Math.min(255, b - Math.round(255 * -amount))),
  ]
}

class MockBindings implements Bindings {
  #options: Ws281xConfig | undefined
  #pixels: Uint32Array = new Uint32Array(0)
  #brightness: number = 1

  // todo: add support for various pixel layouts, e.g. 8x8, 16x16, circle, etc.
  constructor() {
    process.stdout.write(ansiEscapes.cursorHide + ansiEscapes.cursorLeft)
  }
  configure(options: Ws281xConfig) {
    this.#options = options
  }
  render() {
    process.stdout.write(ansiEscapes.cursorLeft + ansiEscapes.eraseLine)
    process.stdout.write(
      Array.from(this.#pixels)
        .map(pixel => {
          const r = (pixel >> 16) & 0xff
          const g = (pixel >> 8) & 0xff
          const b = pixel & 0xff
          return chalk.bgRgb(...brighten([r, g, b], 1 - this.#brightness))(
            '   ',
          )
        })
        .join(' '),
    )
  }
  reset() {}
  setPixels(pixels: Uint32Array) {
    this.#pixels = pixels
  }
  setBrightness(brightness: number) {
    this.#brightness = brightness
  }
}

export function createMockBindings(): Bindings {
  return new MockBindings()
}
