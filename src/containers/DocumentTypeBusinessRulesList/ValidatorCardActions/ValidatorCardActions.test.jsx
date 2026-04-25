
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { render } from '@/utils/rendererRTL'
import { ValidatorCardActions } from './ValidatorCardActions'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/PenIcon', () => ({
  PenIcon: () => <div data-testid={editButtonTestId} />,
}))
jest.mock('@/components/Icons/TrashIcon', () => ({
  TrashIcon: () => <div data-testid={deleteButtonTestId} />,
}))
jest.mock('@/containers/DeleteValidationRuleButton', () => ({
  DeleteValidationRuleButton: ({ renderTrigger }) => renderTrigger(),
}))
jest.mock('../EditBusinessRuleButton', () => ({
  EditBusinessRuleButton: ({ renderTrigger }) => renderTrigger({}),
}))

const editButtonTestId = 'edit-button'
const deleteButtonTestId = 'delete-button'
const mockValidatorId = 'mockValidatorId'
const mockFieldName1 = 'Insurance Date'
const mockFieldName2 = 'Payment'
const mockRuleName = 'Rule Name'

test('renders actions icons', async () => {
  render(
    <ValidatorCardActions
      fieldNames={[mockFieldName1, mockFieldName2]}
      name={mockRuleName}
      validatorCategory={ValidatorCategory.CROSS_FIELD_VALIDATOR}
      validatorId={mockValidatorId}
    />,
  )

  expect(screen.getByTestId(deleteButtonTestId)).toBeInTheDocument()
  expect(screen.getByTestId(editButtonTestId)).toBeInTheDocument()
})
