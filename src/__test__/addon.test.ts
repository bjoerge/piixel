import assert from 'node:assert'
import {test} from 'node:test'

import {testAddon} from '../addon'

test('addon', async () => {
  assert.deepEqual(await testAddon(), [0])
})
