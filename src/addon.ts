import getBindings from 'bindings'

const {createTSFN} = getBindings('addon')

export function testAddon() {
  return new Promise(resolve => {
    createTSFN((...args: unknown[]) => {
      resolve(args)
    })
  })
}
