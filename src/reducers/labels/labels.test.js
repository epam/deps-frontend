
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeLabel,
  storeLabels,
} from '@/actions/labels'
import { labelsReducer } from '@/reducers/labels'

jest.mock('@/utils/env', () => mockEnv)

const state = undefined

describe('Reducer: labels', () => {
  it('Action handler: storeLabel', () => {
    const action = storeLabel('label')

    const expected = ['label']

    expect(labelsReducer(state, action)).toEqual(expected)
  })

  it('Action handler: storeLabels', () => {
    const action = storeLabels(['label1', 'label2'])

    const expected = ['label1', 'label2']

    expect(labelsReducer(state, action)).toEqual(expected)
  })
})
