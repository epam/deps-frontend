
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FIELD_FORM_CODE as MOCK_FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'
import { render } from '@/utils/rendererRTL'
import { GroupSelect } from './GroupSelect'

jest.mock('@/utils/env', () => mockEnv)

const mockResetField = jest.fn()
const mockOnChange = jest.fn()

const mockOption1 = {
  value: 'group1',
  text: 'Group 1',
  documentTypeIds: ['doc-type-1', 'doc-type-2'],
}

const mockOption2 = {
  value: 'group2',
  text: 'Group 2',
  documentTypeIds: ['doc-type-2', 'doc-type-3'],
}

const mockOption3 = {
  value: 'group3',
  text: 'Group 3',
  documentTypeIds: ['doc-type-1'],
}

const mockGroupOptions = [
  mockOption1,
  mockOption2,
  mockOption3,
]

jest.mock('@/containers/DocumentTypesGroupsSelect', () => ({
  DocumentTypesGroupsSelect: ({ onChange, ...props }) => (
    <select
      data-testid="CustomSelect"
      onChange={
        (e) => {
          const group = mockGroupOptions.find((opt) => opt.value === e.target.value)
          onChange(group)
        }
      }
      {...props}
    >
      {
        mockGroupOptions.map((opt) => (
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

jest.mock('react-hook-form', () => ({
  useWatch: jest.fn(({ name }) => {
    if (name === MOCK_FIELD_FORM_CODE.DOCUMENT_TYPE) {
      return 'doc-type-1'
    }
    if (name === MOCK_FIELD_FORM_CODE.FILES) {
      return [
        {
          settings: { documentType: 'doc-type-1' },
        },
        {
          settings: { documentType: 'doc-type-2' },
        },
        {
          settings: { documentType: 'doc-type-3' },
        },
      ]
    }
    return null
  }),
  useFormContext: jest.fn(() => ({
    resetField: mockResetField,
  })),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders select with options', () => {
  render(
    <GroupSelect
      onChange={mockOnChange}
    />,
  )
  expect(screen.getByTestId('CustomSelect')).toBeInTheDocument()
  expect(screen.getByText('Group 1')).toBeInTheDocument()
  expect(screen.getByText('Group 2')).toBeInTheDocument()
  expect(screen.getByText('Group 3')).toBeInTheDocument()
})

test('calls onChange when group is selected', async () => {
  render(
    <GroupSelect
      onChange={mockOnChange}
    />,
  )
  await userEvent.selectOptions(screen.getByTestId('CustomSelect'), mockOption1.value)
  expect(mockOnChange).toHaveBeenCalledWith(mockGroupOptions[0])
})

test('resets document type when selected group does not include current document type', async () => {
  render(
    <GroupSelect
      onChange={mockOnChange}
    />,
  )

  await userEvent.selectOptions(screen.getByTestId('CustomSelect'), mockOption2.value)
  expect(mockResetField).toHaveBeenCalledWith(MOCK_FIELD_FORM_CODE.DOCUMENT_TYPE)
})

test('does not reset document type when selected group includes current document type', async () => {
  render(
    <GroupSelect
      onChange={mockOnChange}
    />,
  )

  await userEvent.selectOptions(screen.getByTestId('CustomSelect'), mockOption1.value)
  expect(mockResetField).not.toHaveBeenCalledWith(MOCK_FIELD_FORM_CODE.DOCUMENT_TYPE)
})

test('resets file document types when they are not included in selected group', async () => {
  render(
    <GroupSelect
      onChange={mockOnChange}
    />,
  )

  await userEvent.selectOptions(screen.getByTestId('CustomSelect'), mockOption3.value)
  expect(mockResetField).toHaveBeenCalledWith(`${MOCK_FIELD_FORM_CODE.FILES}.1.settings.documentType`)
  expect(mockResetField).toHaveBeenCalledWith(`${MOCK_FIELD_FORM_CODE.FILES}.2.settings.documentType`)
  expect(mockResetField).not.toHaveBeenCalledWith(`${MOCK_FIELD_FORM_CODE.FILES}.0.settings.documentType`)
})

test('handles empty files array', async () => {
  const { useWatch } = require('react-hook-form')
  useWatch.mockImplementation(({ name }) => {
    if (name === MOCK_FIELD_FORM_CODE.DOCUMENT_TYPE) return 'doc-type-1'
    if (name === MOCK_FIELD_FORM_CODE.FILES) return []
    return null
  })
  render(
    <GroupSelect
      onChange={mockOnChange}
    />,
  )
  await userEvent.selectOptions(screen.getByTestId('CustomSelect'), mockOption1.value)
  expect(mockResetField).not.toHaveBeenCalledWith(expect.stringContaining(MOCK_FIELD_FORM_CODE.FILES))
})
