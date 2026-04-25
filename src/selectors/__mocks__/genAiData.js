
import { mockSelector } from '@/mocks/mockSelector'
import { GenAiField } from '@/models/GenAiField'

const mockFields = [
  new GenAiField({
    id: 'mock id1',
    key: 'mock key1',
    value: 'mock value1',
  }),
  new GenAiField({
    id: 'mock id2',
    key: 'mock key2',
    value: 'mock value2',
  }),
]

const genAiFieldsSelector = mockSelector(mockFields)

export {
  genAiFieldsSelector,
}
