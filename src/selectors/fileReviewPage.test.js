
import { mockEnv } from '@/mocks/mockEnv'
import {
  fileReviewPageStateSelector,
  highlightedFieldSelector,
} from './fileReviewPage'

jest.mock('@/utils/env', () => mockEnv)

describe('Selectors: fileReviewPage', () => {
  let state

  beforeEach(() => {
    state = {
      fileReviewPage: {
        highlightedField: [[{
          x: 0,
          y: 0,
        }, {
          x: 0.1,
          y: 0.2,
        }]],
        activePolygons: [],
      },
    }
  })

  it('selector: fileReviewPageStateSelector', () => {
    expect(fileReviewPageStateSelector(state)).toBe(state.fileReviewPage)
  })

  it('selector: highlightedFieldSelector', () => {
    expect(highlightedFieldSelector(state)).toEqual(state.fileReviewPage.highlightedField)
  })

  it('selector: highlightedFieldSelector in case of empty highlightedField', () => {
    state.fileReviewPage.highlightedField = undefined

    expect(highlightedFieldSelector(state)).toBeUndefined()
  })
})
