
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { GroupCommandBar } from './GroupCommandBar'

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useDeleteDocumentTypesGroupMutation: jest.fn(() => []),
}))

jest.mock('@/components/Icons/TrashIcon', () => ({
  TrashIcon: () => <div data-testid={trashIconId} />,
}))

jest.mock('@/utils/env', () => mockEnv)

Modal.confirm = jest.fn()

const trashIconId = 'trash-icon'

const mockDocumentTypesGroup = new DocumentTypesGroup({
  id: 'id',
  name: 'group',
  documentTypeIds: [],
  createdAt: '12-12-2012',
})

test('renders GroupCommandBar correctly', async () => {
  const props = {
    group: mockDocumentTypesGroup,
  }

  render(<GroupCommandBar {...props} />)

  const deleteCommand = screen.getByTestId(trashIconId)

  expect(deleteCommand).toBeInTheDocument()
})

test('calls Modal.confirm with correct arguments in case of delete command click', async () => {
  const props = {
    group: mockDocumentTypesGroup,
  }

  render(<GroupCommandBar {...props} />)

  const deleteCommand = screen.getByTestId(trashIconId)

  await userEvent.click(deleteCommand)

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_DOC_TYPES_GROUP, { name: props.group.name }),
    onOk: expect.any(Function),
  })
})
