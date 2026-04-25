
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useWatch } from 'react-hook-form'
import { DocumentType } from '@/models/DocumentType'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { render } from '@/utils/rendererRTL'
import { DocTypeSelect } from './DocTypeSelect'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/requests')
jest.mock('@/selectors/documentTypesListPage')
jest.mock('react-redux', () => mockReactRedux)

jest.mock('@/components/Select', () => ({
  CustomSelect: ({ options, onChange, disabled }) => (
    <select
      data-testid="CustomSelect"
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      {
        options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
          >
            {opt.text}
          </option>
        ))
      }
    </select>
  ),
}))

const mockSetValue = jest.fn()
const mockResetField = jest.fn()

jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(() => ({
    setValue: mockSetValue,
    resetField: mockResetField,
  })),
  useWatch: jest.fn(() => undefined),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders select with options', () => {
  render(
    <DocTypeSelect
      onChange={jest.fn()}
    />,
  )

  expect(screen.getByTestId('CustomSelect')).toBeInTheDocument()
})

test('renders as disabled select when fetching', () => {
  areTypesFetchingSelector.mockReturnValueOnce(true)
  render(<DocTypeSelect onChange={jest.fn()} />)
  expect(screen.getByTestId('CustomSelect')).toBeDisabled()
})

test('calls onChange when option is selected', async () => {
  const onChange = jest.fn()
  const docType = new DocumentType(
    'code1',
    'Type 1',
    'engine1',
    'en',
    undefined,
    [],
    'id1',
  )
  documentTypesSelector.mockReturnValue([docType])
  render(<DocTypeSelect onChange={onChange} />)
  await userEvent.selectOptions(screen.getByTestId('CustomSelect'), 'code1')
  expect(onChange).toHaveBeenCalledWith('code1')
})

test('filters document types by group', () => {
  const docType1 = new DocumentType(
    'code1',
    'Type 1',
    'engine1',
    'en',
    undefined,
    [],
    'id1',
  )
  const docType2 = new DocumentType(
    'code2',
    'Type 2',
    'engine2',
    'en',
    undefined,
    [],
    'id2',
  )
  documentTypesSelector.mockReturnValue([docType1, docType2])
  useWatch.mockReturnValue({ documentTypeIds: ['code2'] })
  render(<DocTypeSelect onChange={jest.fn()} />)
  expect(screen.queryByText('Type 1')).not.toBeInTheDocument()
  expect(screen.getByText('Type 2')).toBeInTheDocument()
})
