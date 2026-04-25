
import { languagesSelector } from './languages'

describe('Selectors: languages', () => {
  let state

  beforeEach(() => {
    state = {
      languages: 'mockLanguages',
    }
  })

  it('selector: labelsSelector', () => {
    expect(languagesSelector(state)).toBe(state.languages)
  })
})
