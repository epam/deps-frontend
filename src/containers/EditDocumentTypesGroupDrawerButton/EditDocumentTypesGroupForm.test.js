
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { EditDocumentTypesGroupForm } from './EditDocumentTypesGroupForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)

const mockGroupId = 'groupId'

const mockDocumentTypesGroup = new DocumentTypesGroup({
  id: mockGroupId,
  name: 'Group Name',
  documentTypeIds: [],
})

test('renders form layout correctly', () => {
  render(
    <EditDocumentTypesGroupForm
      group={mockDocumentTypesGroup}
      handleSubmit={jest.fn()}
      saveGroup={jest.fn()}
    />,
  )

  const input = screen.getByPlaceholderText(localize(Localization.GROUP_PLACEHOLDER))
  const inputTitle = screen.getByText(localize(Localization.NAME))

  expect(inputTitle).toBeInTheDocument()
  expect(input).toBeInTheDocument()
  expect(input).toHaveValue(mockDocumentTypesGroup.name)
})
