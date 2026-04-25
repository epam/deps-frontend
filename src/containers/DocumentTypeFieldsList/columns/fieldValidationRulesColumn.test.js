
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { CrossFieldValidator } from '@/models/CrossFieldValidator'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { Validator, ValidatorRule } from '@/models/Validator'
import { generateFieldValidationRulesColumn } from './fieldValidationRulesColumn'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Table/TableSelectFilter', () => ({
  TableSelectFilter: jest.fn(({ options }) => (
    <ul data-testid="table-select-filter">
      {
        options.map((option) => (
          <li key={option.value}>
            {option.text}
          </li>
        ))
      }
    </ul>
  ),
  ),
}))

jest.mock('@/components/Table/TableFilterIndicator', () => ({
  TableFilterIndicator: jest.fn(() => <div data-testid="table-filter-indicator" />),
}))

jest.mock('../ValidationRulesCell', () => ({
  ValidationRulesCell: jest.fn(() => <div data-testid="validation-rules-cell" />),
}))

const mockCrossFieldValidator = new CrossFieldValidator({
  id: 'mockId',
  name: 'Cross Field Validator Name',
})

const mockValidatorRule = new ValidatorRule({
  name: 'Validator Rule Name',
})

const mockValidator = new Validator({
  code: 'mockFieldCode',
  rules: [mockValidatorRule],
})

const mockDocumentType = new ExtendedDocumentType({
  code: 'mockDocumentTypeCode',
  name: 'mockDocumentTypeName',
  validators: [mockValidator],
  crossFieldValidators: [mockCrossFieldValidator],
})

test('returns the correct column title', () => {
  const column = generateFieldValidationRulesColumn(mockDocumentType)

  expect(column.title).toBe(localize(Localization.BUSINESS_RULES))
})

test('shows the filter dropdown component correctly', () => {
  const column = generateFieldValidationRulesColumn(mockDocumentType)
  const filterDropdown = column.filterDropdown()

  render(filterDropdown)

  expect(screen.getByTestId('table-select-filter')).toBeInTheDocument()
  expect(screen.getByText(mockValidatorRule.name)).toBeInTheDocument()
  expect(screen.getByText(mockCrossFieldValidator.name)).toBeInTheDocument()
})

test('shows Validation rules cell after the render function call', () => {
  const mockRecord = {
    code: 'mockFieldCode',
    validationRules: [mockValidatorRule, mockCrossFieldValidator],
  }

  const column = generateFieldValidationRulesColumn(mockDocumentType)
  const renderResult = column.render([mockRecord], mockRecord)

  render(renderResult)

  expect(screen.getByTestId('validation-rules-cell')).toBeInTheDocument()
})

test('shows the filterIcon component correctly', () => {
  const column = generateFieldValidationRulesColumn(mockDocumentType)
  const filterIcon = column.filterIcon()

  render(filterIcon)

  expect(screen.getByTestId('table-filter-indicator')).toBeInTheDocument()
})

test('filters records by validator name correctly', () => {
  const mockRecord = {
    code: 'mockFieldCode',
    validationRules: [mockValidatorRule, mockCrossFieldValidator],
  }

  const column = generateFieldValidationRulesColumn(mockDocumentType)

  const isFilteredByValidatorName = column.onFilter(mockValidatorRule.name, mockRecord)
  expect(isFilteredByValidatorName).toBeTruthy()

  const isFilteredByNonExistingName = column.onFilter('some name', mockRecord)
  expect(isFilteredByNonExistingName).toBeFalsy()
})
