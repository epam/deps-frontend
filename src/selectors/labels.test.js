
import { labelsSelector } from './labels'

describe('Selectors: labels', () => {
  let state

  beforeEach(() => {
    state = {
      labels: 'mockLabels',
    }
  })

  it('selector: labelsSelector', () => {
    expect(labelsSelector(state)).toBe(state.labels)
  })
})
