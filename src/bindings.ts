import getBindings from 'bindings'

import {createMockBindings} from './mock'
import {Ws281xConfig} from './ws281x'

export interface Bindings {
  configure(options: Ws281xConfig): void
  render: () => void
  reset: () => void
  setPixels(pixels: Uint32Array): void
  setBrightness(brightness: number): void
}

/**
 * Parse the MOCK_PIIXEL environment variable.
 * Possible formats:
 *  - "true" to enable mock mode, rendering a single strip of all pixels
 *  - "-1" to enable mocking without terminal rendering
 *  - "<h>x<w>" to render a <h>x<w> grid of pixels
 *  - "false" or "0" disables mocking
 * @param env
 */
function parseMockEnv(env: string) {
  const [h, w] = env.split('x').map(Number)
  if (isNaN(h)) {
    return {h: 1}
  }
  return {h, w}
}

function tryGetBindings(): Bindings {
  try {
    return getBindings('addon')
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ERR_DLOPEN_FAILED') {
        if (process.env.MOCK_PIIXEL) {
          return createMockBindings(parseMockEnv(process.env.MOCK_PIIXEL))
        }
        error.message = `WS281x native bindings could not be loaded. Set MOCK_PIIXEL=true to render pixels to terminal.\n\nOriginal error: ${error.message}`
      }
      if ('tries' in error && Array.isArray(error.tries)) {
        error.message = `!!This package is only works on a Raspberry PI!! ${error.message}`
      }
    }
    throw error
  }
}

export const bindings = tryGetBindings()
