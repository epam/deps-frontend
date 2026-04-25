
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import { GroupCommandBar } from '@/containers/DocumentTypesGroups/GroupCommandBar'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { generateGroupActionsColumn } from '../groupActionsColumn'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DocumentTypesGroups/GroupCommandBar', () => ({
  GroupCommandBar: jest.fn(() => <div data-testid="command-bar" />),
}))

test('returns the correct column configuration', () => {
  const column = generateGroupActionsColumn()
  const mockDocumentTypesGroup = new DocumentTypesGroup({
    id: 'id',
    name: 'Group Name',
    documentTypeIds: [],
  })

  const renderResult = column.render(mockDocumentTypesGroup)

  render(renderResult)

  expect(screen.getByTestId('command-bar')).toBeInTheDocument()
  expect(GroupCommandBar).toHaveBeenCalledWith(
    { group: mockDocumentTypesGroup },
    {},
  )
})
