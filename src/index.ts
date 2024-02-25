import getBindings from 'bindings'

const index = getBindings('addon')

const DEFAULT_CALCULATIONS = 100000000

export function runSync(calculations = DEFAULT_CALCULATIONS) {
  const start = Date.now()
  // Estimate() will execute in the current thread,
  // the next line won't return until it is finished
  const result = index.calculateSync(calculations)
  return {result, ms: Date.now() - start}
}

export function runAsync(calculations = DEFAULT_CALCULATIONS, batches = 16) {
  return new Promise<{ms: number; result: number}>(resolve => {
    let ended = 0
    let total = 0
    const start = Date.now()

    function done(err: Error, result: number) {
      total += result

      // have all the batches finished executing?
      if (++ended === batches) {
        resolve({result: total / batches, ms: Date.now() - start})
      }
    }

    // for each batch of work, request an async Estimate() for
    // a portion of the total number of calculations
    for (let i = 0; i < batches; i++) {
      index.calculateAsync(calculations / batches, done)
    }
  })
}
