
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { render } from '@/utils/rendererRTL'
import { ReferenceLayoutFieldListView } from './ReferenceLayoutFieldListView'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('./TableList', () => mockShallowComponent('TableList'))
jest.mock('./KeyValueList', () => mockShallowComponent('KeyValueList'))

test('shows k-v list if view type is Fields', () => {
  render(
    <ReferenceLayoutFieldListView
      fieldsViewType={PrototypeViewType.FIELDS}
      isEditMode
      prototypeMappingKeys={[]}
    />,
  )

  expect(screen.getByTestId('KeyValueList')).toBeInTheDocument()
})

test('shows table list if view type is Tables', () => {
  render(
    <ReferenceLayoutFieldListView
      fieldsViewType={PrototypeViewType.TABLES}
      isEditMode
      prototypeMappingKeys={[]}
    />,
  )

  expect(screen.getByTestId('TableList')).toBeInTheDocument()
})
