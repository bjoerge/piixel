import assert from 'node:assert'
import {test} from 'node:test'

import {runAsync, runSync} from '../addon'

test('addon sync', () => {
  assert.equal(runSync().result, 3.14171528)
})

test('addon sync', async () => {
  assert.equal((await runAsync()).result, 3.1411942399999995)
})
