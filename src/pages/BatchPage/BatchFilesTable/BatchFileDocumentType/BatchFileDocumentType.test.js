
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { render } from '@/utils/rendererRTL'
import { BatchFileDocumentType } from './BatchFileDocumentType'

var mockLongText

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentTypesListPage')

jest.mock('@/components/LongText', () => {
  const mock = mockShallowComponent('LongText')
  mockLongText = mock.LongText
  return mock
})

test('shows LongText with file document type correctly', () => {
  const documentTypeId = 'id1'

  const dtName = documentTypesSelector.getSelectorMockValue().find((dt) => dt.id === documentTypeId).name

  render(<BatchFileDocumentType documentTypeId={documentTypeId} />)

  expect(mockLongText.getProps()).toEqual({
    text: dtName,
  })
})
