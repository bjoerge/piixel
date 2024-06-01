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

function tryGetBindings(): Bindings {
  try {
    return getBindings('addon')
  } catch (error: unknown) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ERR_DLOPEN_FAILED') {
        if (process.env.MOCK_PIIXEL) {
          return createMockBindings()
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
