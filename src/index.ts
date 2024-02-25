import getBindings from 'bindings'

const addon = getBindings('addon')

/**
 * Strip type identifiers
 * @see https://github.com/jgarff/rpi_ws281x/blob/master/ws2811.h#L46
 */
export const enum StripType {
  // 4 color R, G, B and W ordering
  SK6812_STRIP_RGBW = 0x18100800,
  SK6812_STRIP_RBGW = 0x18100008,
  SK6812_STRIP_GRBW = 0x18081000,
  SK6812_STRIP_GBRW = 0x18080010,
  SK6812_STRIP_BRGW = 0x18001008,
  SK6812_STRIP_BGRW = 0x18000810,
  SK6812_SHIFT_WMASK = 0xf0000000,

  // 3 color R, G and B ordering,
  WS2811_STRIP_RGB = 0x00100800,
  WS2811_STRIP_RBG = 0x00100008,
  WS2811_STRIP_GRB = 0x00081000,
  WS2811_STRIP_GBR = 0x00080010,
  WS2811_STRIP_BRG = 0x00001008,
  WS2811_STRIP_BGR = 0x00000810,

  // predefined fixed LED types,
  WS2812_STRIP = WS2811_STRIP_GRB,
  SK6812_STRIP = WS2811_STRIP_GRB,
  SK6812W_STRIP = SK6812_STRIP_GRBW,
}

export interface Options {
  /**
   * Number of leds to control
   */
  leds: number

  /**
   *  DMA channel
   *  @see https://github.com/jgarff/rpi_ws281x/blob/master/README.md#important-warning-about-dma-channels
   */
  dma?: number

  /**
   * Set the GPIO number to communicate with the Neopixel strip (default 18)
   */
  gpio?: number

  /**
   * Set brightness, a value from 0 to 1, default 1
   */
  brightness?: number

  /**
   * Strip type
   */
  type?: StripType
}

class Ws281x {
  #leds?: number
  #configured = false
  #defaultMapping: Uint32Array
  constructor() {
    this.#leds = 0
    this.#defaultMapping = new Uint32Array(0)
  }

  configure(options: Options) {
    if (this.#configured) {
      throw new Error('ws281x already configured. Call ws281x.reset() first')
    }
    if (options.leds !== this.#leds) {
      this.#leds = options.leds
      this.#defaultMapping = new Uint32Array(options.leds)
    }
    const ret = addon.configure(options)
    this.#configured = true
    return ret
  }

  reset() {
    if (this.#leds !== undefined) {
      addon.reset()
    }
    this.#leds = undefined
  }

  sleep(ms: number) {
    addon.sleep(ms)
  }

  render(pixels: Uint32Array, mapping?: Uint32Array) {
    if (this.#leds === undefined) {
      throw new Error('Must call configure() before render()')
    }
    if (pixels.length !== this.#leds) {
      throw new Error('Number of pixels cannot change between renders')
    }

    return addon.render(pixels)
  }
}

function map(pixels: Uint32Array, mapping: Uint32Array) {
  const mapped = new Uint32Array(pixels.length)
  for (let i = 0; i < pixels.length; i++) {
    mapped[i] = pixels[mapping[i]]
  }
  return mapped
}

export default new Ws281x()

