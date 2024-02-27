const {test} = require('node:test')
const assert = require('node:assert')

const addon = require('bindings')('addon')

test('binding.configure() error handling', () => {
  assert.throws(() => {
    addon.configure()
  }, /expected an options object/)

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

test('binding.render() error handling', () => {
  assert.throws(() => {
    addon.render()
  }, /expected an Uint32Array/)
})
