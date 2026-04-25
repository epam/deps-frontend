
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { KeyValuePairElementLayout, KeyValuePairLayout } from '@/models/DocumentLayout'
import { keyToAssignSelector } from '@/selectors/prototypePage'
import { render } from '@/utils/rendererRTL'
import { KeyValueItem } from './'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/prototypePage')
jest.mock('@/components/Icons/FaCircleCheckIcon', () => ({
  FaCircleCheckIcon: () => <div data-testid='check-icon' />,
}))

const mockItem = new KeyValuePairLayout({
  key: new KeyValuePairElementLayout(
    'mockKey',
    [{
      x: 0,
      y: 2,
    }],
  ),
  value: new KeyValuePairElementLayout('mockValue'),
  id: 'mockId',
  confidence: 42,
})

test('show key and value field correctly', () => {
  render(
    <KeyValueItem
      checkIsKeyAssigned={jest.fn()}
      item={mockItem}
    />,
  )

  const key = screen.getByText(mockItem.key.content)
  const value = screen.getByText(mockItem.value.content)

  expect(key).toBeInTheDocument()
  expect(value).toBeInTheDocument()
})

test('highlight key value item in case of selection', () => {
  keyToAssignSelector.mockReturnValueOnce(mockItem.key.content)
  const activeElementStyles = {
    borderWidth: '1px',
    borderStyle: 'solid',
  }
  render(
    <KeyValueItem
      checkIsKeyAssigned={jest.fn()}
      item={mockItem}
    />,
  )

  const keyContent = screen.getByText(mockItem.key.content)
  const valueContent = screen.getByText(mockItem.value.content)

  expect(keyContent).toHaveStyle(activeElementStyles)
  expect(valueContent).toHaveStyle(activeElementStyles)
})

test('show CheckIcon if field is assigned', () => {
  render(
    <KeyValueItem
      checkIsKeyAssigned={jest.fn(() => true)}
      item={mockItem}
    />,
  )

  const icon = screen.getByTestId('check-icon')

  expect(icon).toBeInTheDocument()
})

test('not show CheckIcon if field is not assigned', () => {
  render(
    <KeyValueItem
      checkIsKeyAssigned={jest.fn()}
      item={mockItem}
    />,
  )

  const icon = screen.queryByTestId('check-icon')

  expect(icon).not.toBeInTheDocument()
})
