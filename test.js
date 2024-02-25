const {test} = require('node:test')
const assert = require('node:assert')

const addon = require('bindings')('addon')

test('configure()', () => {
  assert.throws(
    () => {
      addon.configure()
    },
    {message: 'Configure must be called with an options object'},
  )
  assert.throws(() => {
    addon.configure({leds: '21'})
  }, /`leds` must be a number/)

  assert.throws(() => {
    addon.configure({leds: 16, gpio: '21'})
  }, /`gpio` must be a number/)

  assert.throws(() => {
    addon.configure({leds: 16, gpio: '21'})
  }, /`gpio` must be a number/)

  assert.throws(() => {
    addon.configure({leds: 16, gpio: 21, dma: '10'})
  }, /`dma` must be a number/)

  assert.throws(() => {
    addon.configure({leds: 16, gpio: 21, brightness: '100'})
  }, /`brightness` must be a number/)

  assert.throws(() => {
    addon.configure({leds: 16, gpio: 21, type: 'xyz'})
  }, /`type` must be a number/)
})

test.only('render()', () => {
  addon.configure({leds: 1, gpio: 18})

  addon.render(new Uint32Array(2))
})
