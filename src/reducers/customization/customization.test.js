
import { setCustomization } from '@/actions/customization'
import { customizationReducer } from './customization'

const mockCustomization = { theme: {} }

describe('Reducer: customization', () => {
  let state

  beforeAll(() => {
    state = {}
  })

  it('should correctly handle setCustomization action', () => {
    const action = setCustomization(mockCustomization)
    expect(customizationReducer(state, action)).toEqual(action.payload)
  })
})
