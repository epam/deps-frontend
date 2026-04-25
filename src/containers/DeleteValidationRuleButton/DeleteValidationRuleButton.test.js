
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { render } from '@/utils/rendererRTL'
import { DeleteValidationRuleButton } from './DeleteValidationRuleButton'
import { useDeleteValidationRuleAction } from './useDeleteValidationRuleAction'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./useDeleteValidationRuleAction', () => ({
  useDeleteValidationRuleAction: jest.fn(() => mockHookData),
}))

const mockHookData = {
  confirmAndDeleteValidationRule: jest.fn(),
}

const MockTrigger = (onClick) => (
  <button
    data-testid='delete-trigger'
    onClick={onClick}
  />
)

const defaultProps = {
  fieldNames: ['Field Name'],
  renderTrigger: MockTrigger,
  ruleName: 'mockRuleName',
  validatorCategory: ValidatorCategory.VALIDATOR,
  validatorId: 'mockValidatorId',
}

test('shows content according renderTrigger prop', async () => {
  render(<DeleteValidationRuleButton {...defaultProps} />)

  expect(screen.getByTestId('delete-trigger')).toBeInTheDocument()
})

test('calls hook useDeleteValidationRuleAction', async () => {
  render(<DeleteValidationRuleButton {...defaultProps} />)

  expect(useDeleteValidationRuleAction).toHaveBeenCalled()
})

test('calls delete action with correct arguments on delete trigger click', async () => {
  render(<DeleteValidationRuleButton {...defaultProps} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockHookData.confirmAndDeleteValidationRule).nthCalledWith(1, {
    fieldNames: defaultProps.fieldNames,
    ruleName: defaultProps.ruleName,
    validatorCategory: defaultProps.validatorCategory,
    validatorId: defaultProps.validatorId,
  })
})
