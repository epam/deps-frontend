
import { customizationSelector } from './customization'

describe('Selectors: customization', () => {
  let state

  beforeEach(() => {
    state = {
      customization: 'mockCustomization',
    }
  })

  it('selector: customizationSelector', () => {
    expect(customizationSelector(state)).toBe(state.customization)
  })
})
