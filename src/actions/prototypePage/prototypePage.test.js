
import { clearKeyToAssign, storeKeyToAssign } from './prototypePage'

describe('Action: clearKeyToAssign', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call dispatch with storeKeyToAssign action with correct args', () => {
    const expectedArgument = null
    clearKeyToAssign()(dispatch)

    expect(dispatch).nthCalledWith(1, storeKeyToAssign(expectedArgument))
  })
})
