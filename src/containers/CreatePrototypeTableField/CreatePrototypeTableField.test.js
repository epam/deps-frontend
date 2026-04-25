
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { toggleAddFieldDrawer } from '@/actions/prototypePage'
import { FieldType } from '@/enums/FieldType'
import { showTableDrawerSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { CreatePrototypeTableField } from './CreatePrototypeTableField'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/PrototypeTableFieldDrawer', () => mockShallowComponent('PrototypeTableFieldDrawer'))
jest.mock('@/selectors/prototypePage')

jest.mock('@/actions/prototypePage', () => ({
  toggleAddFieldDrawer: jest.fn(() => ({ type: 'mockType' })),
}))

let MockDrawer

beforeAll(() => {
  const { PrototypeTableFieldDrawer } = require('@/containers/PrototypeTableFieldDrawer')
  MockDrawer = PrototypeTableFieldDrawer
})

test('shows drawer if showTableDrawer state is true', async () => {
  showTableDrawerSelector.mockReturnValueOnce(true)

  render(
    <CreatePrototypeTableField
      addField={jest.fn()}
    />,
  )

  expect(screen.getByTestId('PrototypeTableFieldDrawer')).toBeInTheDocument()
})

test('does not show drawer if showTableDrawer state is false', async () => {
  showTableDrawerSelector.mockReturnValue(false)

  render(
    <CreatePrototypeTableField
      addField={jest.fn()}
    />,
  )

  const { visible } = MockDrawer.getProps()

  expect(visible).toBe(false)
})

test('calls addField on table field save', async () => {
  const mockSubmitData = {
    name: 'mockName',
    headerType: 'columns',
    headers: 'mockHeader',
    occurrenceIndex: 1,
  }
  const mockAddField = jest.fn()

  render(
    <CreatePrototypeTableField
      addField={mockAddField}
    />,
  )

  const { onSave } = MockDrawer.getProps()
  onSave(mockSubmitData)

  const { name, ...tabularMapping } = mockSubmitData

  expect(mockAddField).nthCalledWith(1, expect.objectContaining({
    name,
    fieldType: {
      typeCode: FieldType.TABLE,
      description: {},
    },
    tabularMapping,
  }))
})

test('calls toggleAddFieldDrawer on close drawer', async () => {
  jest.clearAllMocks()

  render(
    <CreatePrototypeTableField
      addField={jest.fn()}
    />,
  )

  const { closeDrawer } = MockDrawer.getProps()
  closeDrawer()

  expect(toggleAddFieldDrawer).toHaveBeenCalledTimes(1)
})
