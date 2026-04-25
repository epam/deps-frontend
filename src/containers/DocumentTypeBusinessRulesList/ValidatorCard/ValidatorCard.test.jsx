
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { RESOURCE_VALIDATION_RULE_SEVERITY, ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { Tag } from '@/models/Tag'
import { render } from '@/utils/rendererRTL'
import { ValidatorCard } from './ValidatorCard'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/LongTagsList', () => ({
  LongTagsList: jest.fn(({ tags }) => (
    tags.map((t) => <div key={t.id}>{t.text}</div>)
  )),
}))
jest.mock('../ValidatorCardActions', () => ({
  ValidatorCardActions: () => <div data-testid={cardActionsTestId} />,
}))

const cardActionsTestId = 'card-actions'
const mockFieldName1 = 'Insurance Date'
const mockFieldName2 = 'Payment'
const mockRuleName = 'Rule Name'
const mockIssueMessage = 'Please check Insurance Date'
const mockValidatorId = 'mockValidatorId'

const fieldsTags = [
  new Tag({
    id: 'f1',
    text: mockFieldName1,
  }),
  new Tag({
    id: 'f2',
    text: mockFieldName2,
  }),
]
test('renders validator card with name, message, tags and severity', () => {
  render(
    <ValidatorCard
      fieldsTags={fieldsTags}
      message={mockIssueMessage}
      name={mockRuleName}
      severity={ValidationRuleSeverity.WARNING}
      validatorCategory={ValidatorCategory.CROSS_FIELD_VALIDATOR}
      validatorId={mockValidatorId}
    />,
  )

  expect(screen.getByText(mockRuleName)).toBeInTheDocument()
  expect(screen.getByText(mockIssueMessage)).toBeInTheDocument()
  expect(screen.getByText(RESOURCE_VALIDATION_RULE_SEVERITY[ValidationRuleSeverity.WARNING])).toBeInTheDocument()
  expect(screen.getByText(mockFieldName1)).toBeInTheDocument()
  expect(screen.getByText(mockFieldName2)).toBeInTheDocument()
})

test('renders validator card actions', () => {
  render(
    <ValidatorCard
      fieldsTags={fieldsTags}
      message={mockIssueMessage}
      name={mockRuleName}
      severity={ValidationRuleSeverity.WARNING}
      validatorCategory={ValidatorCategory.CROSS_FIELD_VALIDATOR}
      validatorId={mockValidatorId}
    />,
  )

  expect(screen.getByTestId(cardActionsTestId)).toBeInTheDocument()
})
