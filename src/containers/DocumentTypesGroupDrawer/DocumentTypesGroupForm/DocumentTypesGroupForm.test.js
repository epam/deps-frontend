
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { render } from '@/utils/rendererRTL'
import { DocumentTypesGroupForm } from './DocumentTypesGroupForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => ({
  ...mockReactHookForm,
  useFormContext: jest.fn(() => ({
    setValue: mockCallback,
  })),
}))

const mockCallback = jest.fn()

const mockDocumentTypes = [
  new DocumentType(
    'code1',
    'DocumentType1',
  ),
  new DocumentType(
    'code2',
    'DocumentType2',
  ),
]

test('render DocumentTypesGroupForm layout correctly', () => {
  const props = {
    documentTypes: mockDocumentTypes,
  }

  render(<DocumentTypesGroupForm {...props} />)

  const expectedLabels = [
    localize(Localization.NAME),
    localize(Localization.DOCUMENT_TYPES),
  ]

  expectedLabels.forEach((label) => {
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
