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
  #layout: {h: number; w?: number}

  // todo: add support circular layout
  constructor(layout: {h: number; w?: number} = {h: 1}) {
    this.#layout = layout
    if (layout.h !== -1) {
      process.stdout.write(ansiEscapes.cursorHide)
    }
  }

  configure(options: Ws281xConfig) {
    this.#options = options
  }
  render() {
    const height = this.#layout.h
    if (height === -1) {
      return
    }

    const width =
      this.#layout.w ?? Math.ceil(this.#pixels.length / this.#layout.h)

    const pixels = new Array(height)
      .fill(0)
      .map((_, row) =>
        new Array(width)
          .fill(0)
          .map((_, col) => {
            const pixel = this.#pixels[row * width + col]
            const r = (pixel >> 16) & 0xff
            const g = (pixel >> 8) & 0xff
            const b = pixel & 0xff
            return chalk.bgRgb(...brighten([r, g, b], 1 - this.#brightness))(
              '   ',
            )
          })
          .join(''),
      )
      .join('\n')

    process.stdout.write(
      ansiEscapes.cursorLeft + ansiEscapes.eraseLines(height) + pixels,
    )
  }
  reset() {
    process.stdout.write(ansiEscapes.cursorShow)
  }
  setPixels(pixels: Uint32Array) {
    this.#pixels = pixels
  }
  setBrightness(brightness: number) {
    this.#brightness = brightness
  }
}

export function createMockBindings(layout: {h: number; w?: number}): Bindings {
  return new MockBindings(layout)
}
