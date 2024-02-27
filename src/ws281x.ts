import getBindings from 'bindings'

function tryGetBindings() {
  try {
    return getBindings('addon')
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      'tries' in error &&
      Array.isArray(error.tries)
    ) {
      error.message = `!!This package is only works on a Raspberry PI!! ${error.message}`
    }
    throw error
  }
}

const bindings = tryGetBindings()

/**
 * @public
 * LED strip type identifiers
 * See {@link https://github.com/jgarff/rpi_ws281x/blob/master/ws2811.h#L46}
 */
export const enum StripType {
  // 4 color R, G, B and W ordering
  SK6812_STRIP_RGBW = 0x18100800,
  SK6812_STRIP_RBGW = 0x18100008,
  SK6812_STRIP_GRBW = 0x18081000,
  SK6812_STRIP_GBRW = 0x18080010,
  SK6812_STRIP_BRGW = 0x18001008,
  SK6812_STRIP_BGRW = 0x18000810,

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

/**
 * @public
 * PWM0, which can be set to use GPIOs 12, 18, 40, and 52.
 * Only 12 (pin 32) and 18 (pin 12) are available on the B+/2B/3B
 * See {@link https://github.com/jgarff/rpi_ws281x?tab=readme-ov-file#pwm}
 */
export type PWM0Gpio = 12 | 18 | 40 | 52

/**
 * @public
 * PWM1 which can be set to use GPIOs 13, 19, 41, 45 and 53.
 * Only 13 is available on the B+/2B/PiZero/3B, on pin 33
 * See {@link https://github.com/jgarff/rpi_ws281x?tab=readme-ov-file#pwm}
 */
export type PWM1Gpio = 13 | 19 | 41 | 45 | 53

/**
 * @public
 * PCM_DOUT, which can be set to use GPIOs 21 and 31.
 * Only 21 is available on the B+/2B/PiZero/3B, on pin 40.
 * See {@link https://github.com/jgarff/rpi_ws281x?tab=readme-ov-file#pcm}
 */
export type PCMGpio = 21 | 31

/**
 * @public
 * SPI0-MOSI is available on GPIOs 10 and 38.
 * Only GPIO 10 is available on all models.
 * See {@link https://github.com/jgarff/rpi_ws281x?tab=readme-ov-file#spi}
 */
export type SPIGpio = 10 | 38

/**
 * @public
 *
 * Valid GPIOs to use with the Ws281x library
 */
export type ValidGPIO = PWM0Gpio | PWM1Gpio | PCMGpio | SPIGpio

/**
 * @public
 * Configuration options for the Ws281x library
 */
export interface Ws281xConfig {
  /**
   * @public
   * Number of LEDs to control
   */
  leds: number

  /**
   * @public
   * Set the GPIO number to communicate with the Neopixel strip (default 18, PWM0)
   */
  gpio?: ValidGPIO

  /**
   * @public
   * Reset the LEDs on process exit (default false)
   */
  resetOnExit?: boolean

  /**
   * @public
   *  DMA channel to use (default 10)
   *  See {@link https://github.com/jgarff/rpi_ws281x/blob/master/README.md#important-warning-about-dma-channels}
   */
  dma?: number

  /**
   * @public
   * Strip type (default {@link StripType.WS2811_STRIP_GRB})
   */
  type?: StripType
}

/**
 * @public
 * Options for rendering pixels to the LED strip
 */
export interface RenderOptions {
  /**
   * @public
   * Pixels to render to the LED strip
   */
  pixels?: Uint32Array

  /**
   * @public
   * Brightness of the LED strip (0.0 - 1.0)
   */
  brightness?: number
}

/**
 * @public
 * The Ws281x API
 */
export interface Ws281xAPI {
  /**
   * @public
   * Configure the library
   *
   * @param options - configuration options
   */
  configure(options: Ws281xConfig): void

  /**
   * @public
   * Clear the LEDs (set all to off)
   */
  clear(): void

  /**
   * @public
   * Render the given pixels to the LED strip
   */
  render(renderOptions: RenderOptions): void

  /**
   * @public
   * Render the given pixels to the LED strip
   */
  render(pixels: Uint32Array): void

  /**
   * @public
   * Reset the library and release resources
   */
  reset(): void
}
/**
 * @internal
 * The Ws281x class
 */
class Ws281xImpl implements Ws281xAPI {
  #leds?: number = undefined
  #resetOnExit = false
  constructor() {
    process.once('exit', () => {
      if (this.#resetOnExit) {
        this.clear()
      }
    })
  }
  configure({resetOnExit, ...options}: Ws281xConfig) {
    if (this.#leds !== undefined) {
      throw new Error(
        'ws281x is already configured. Call ws281x.reset() first!',
      )
    }
    this.#resetOnExit = resetOnExit ?? false
    this.#leds = options.leds
    bindings.configure(options)
  }

  reset() {
    if (this.#leds !== undefined) {
      this.clear()
      bindings.reset()
    }
    this.#leds = undefined
  }

  clear() {
    if (this.#leds !== undefined) {
      this.render(new Uint32Array(this.#leds))
    }
  }

  render(pixelsOrOpts: Uint32Array | RenderOptions) {
    if (pixelsOrOpts instanceof Uint32Array) {
      this.#render({pixels: pixelsOrOpts})
    } else {
      this.#render(pixelsOrOpts)
    }
  }

  #render(options: RenderOptions) {
    if (this.#leds === undefined) {
      throw new Error('Must call configure() before render()')
    }
    const ops: (() => void)[] = []
    if (options.pixels !== undefined) {
      if (options.pixels.length !== this.#leds) {
        throw new Error(
          `Size of pixels array must match number of LEDs (expected: ${this.#leds}, got: ${options.pixels.length})`,
        )
      }
      ops.push(() => bindings.setPixels(options.pixels))
    }
    if (options.brightness !== undefined) {
      ops.push(() => bindings.setBrightness(options.brightness))
    }

    if (ops.length === 0) {
      // nothing to do
      return
    }
    ops.forEach(op => op())
    bindings.render()
  }
}

/**
 * @public
 * Singleton instance of Ws281x
 * @example
 *
 * ```typescript
 * import {colorwheel, StripType, ws281x} from 'piixel'
 *
 * const LEDS = 16
 *
 * // Configure the library. Must be called before calling `render`.
 * ws281x.configure({
 *   gpio: 18,
 *   leds: LEDS,
 *   brightness: 0.2,
 *   type: StripType.WS2811_STRIP_GRB,
 * })
 *
 * const pixels = new Uint32Array(LEDS)
 * for (let i = 0; i < LEDS; i++) {
 *   pixels[i] = colorwheel((i * 256) / LEDS)
 * }
 * // Render pixels to the LED strip
 * ws281x.render(pixels)
 * ```
 */
export const ws281x: Ws281xAPI = new Ws281xImpl()
