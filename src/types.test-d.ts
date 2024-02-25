import ws281x, {StripType} from './'

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
