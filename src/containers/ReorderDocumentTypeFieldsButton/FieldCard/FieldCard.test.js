
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { FieldType } from '@/enums/FieldType'
import { render } from '@/utils/rendererRTL'
import { FieldCard } from './FieldCard'

const dragAndDropIcon = 'drag-and-drop-icon'
const stringFieldIcon = 'string-field-icon'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/MenuOutlinedIcon', () => ({
  MenuOutlinedIcon: () => <div data-testid={dragAndDropIcon} />,
}))

jest.mock('@/components/Icons/StringFieldIcon', () => ({
  StringFieldIcon: () => <div data-testid={stringFieldIcon} />,
}))

const mockFieldName = 'name'
const mockOrder = 1

test('shows correct field content', async () => {
  render(
    <FieldCard
      category={DocumentTypeFieldCategory.EXTRA}
      enableDragging={jest.fn()}
      name={mockFieldName}
      order={mockOrder}
      type={FieldType.STRING}
    />,
  )

  const icon = screen.getByTestId(stringFieldIcon)
  const nameText = screen.getByText(mockFieldName)
  const categoryText = screen.getByText(mockFieldName)
  const orderText = screen.getByText(mockOrder)
  const dragAndDropButton = screen.getByTestId(dragAndDropIcon)

  expect(icon).toBeInTheDocument()
  expect(nameText).toBeInTheDocument()
  expect(categoryText).toBeInTheDocument()
  expect(orderText).toBeInTheDocument()
  expect(dragAndDropButton).toBeInTheDocument()
})
