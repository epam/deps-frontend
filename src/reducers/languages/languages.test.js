
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeLanguages,
} from '@/actions/languages'
import { languagesReducer } from '@/reducers/languages'

jest.mock('@/utils/env', () => mockEnv)

let stateBefore = []

describe('Reducer: Languages', () => {
  describe('Action handler: storeLanguages', () => {
    it('should languages to the state object', () => {
      const languages = ['rus']
      const action = storeLanguages(languages)

      expect(languagesReducer(stateBefore, action)).toEqual(languages)
    })

    it('should override previous languages', () => {
      stateBefore = ['rus', 'eng']

      const languages = ['eng', 'rus', 'fr']
      const action = storeLanguages(languages)

      expect(languagesReducer(stateBefore, action)).toEqual(languages)
    })
  })
})
