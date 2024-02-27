import {test} from 'vitest'

import {StripType, ws281x} from '../ws281x'

test('types work properly', () => {
  ws281x.configure({
    //@ts-expect-error - must be number
    gpio: '18',
    //@ts-expect-error - must be number
    leds: '16',

    //@ts-expect-error - must be from enum
    type: 2,
  })

  ws281x.configure({
    //@ts-expect-error - must be number
    gpio: '18',
    //@ts-expect-error - must be number
    leds: '16',
    type: StripType.SK6812_STRIP,
  })

  //@ts-expect-error - must be Uint32Array
  ws281x.render(new Uint8Array(16))
})
