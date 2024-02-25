import getBindings from 'bindings'
import {clear} from './mappings'

const addon = getBindings('addon')

export interface Options {
  /**
   * Number of leds to control
   */
  leds: number

  /**
   *  DMA channel
   *  @see https://github.com/jgarff/rpi_ws281x/blob/1f47b59ed603223d1376d36c788c89af67ae2fdc/README.md#important-warning-about-dma-channels
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
   * The RGB sequence may vary on some strips. Valid values
   *  are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
   *  Default is "rgb".
   *  RGBW strips are not currently supported.
   */
  type?: "rgb" | "rbg" | "grb" | "gbr" | "bgr" | "brg"
}


export interface Options {
  /**
   * Number of leds to control
   */
  leds: number

  /**
   *  DMA channel
   *  @see https://github.com/jgarff/rpi_ws281x/blob/1f47b59ed603223d1376d36c788c89af67ae2fdc/README.md#important-warning-about-dma-channels
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
   * The RGB sequence may vary on some strips. Valid values
   *  are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
   *  Default is "rgb".
   *  RGBW strips are not currently supported.
   */
  type?: "rgb" | "rbg" | "grb" | "gbr" | "bgr" | "brg"
}

class Ws281x {
  #leds?: number
  #defaultMapping: Uint32Array
  constructor() {
    this.#leds = 0
    this.#defaultMapping = new Uint32Array(0)
  }

  configure(options: Options) {
    if (options.leds !== this.#leds) {
      this.#leds = options.leds
      this.#defaultMapping = new Uint32Array(options.leds)
    }
    addon.configure(options)
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
      throw new Error("Must call configure() before render()")
    }
    if (pixels.length !== this.#leds) {
      throw new Error("Number of pixels cannot change between renders")
    }

    addon.render(pixels, mapping || this.#defaultMapping)
  }
}

export default new Ws281x()

