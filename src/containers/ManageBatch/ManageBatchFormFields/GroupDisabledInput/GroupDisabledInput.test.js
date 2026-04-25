
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useFetchDocumentTypesGroupQuery } from '@/apiRTK/documentTypesGroupsApi'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { GroupDisabledInput } from './GroupDisabledInput'

jest.mock('@/utils/env', () => mockEnv)

const mockId = 'mockId'

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({
    id: mockId,
  })),
}))

jest.mock('@/apiRTK/batchesApi', () => ({
  useFetchBatchQuery: jest.fn(() => ({
    data: {
      id: 'mockBatchId',
      name: 'Mock Batch',
      group: 'id1',
    },
  })),
}))

const mockDocTypesGroupResponse = {
  data: {
    group: new DocumentTypesGroup({
      id: 'id1',
      name: 'Group1',
      documentTypeIds: ['testType1', 'testType2'],
      createdAt: '2012-12-12',
    }),
  },
  isFetching: false,
  error: null,
}

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useFetchDocumentTypesGroupQuery: jest.fn(() => mockDocTypesGroupResponse),
}))

const props = {
  value: undefined,
  onChange: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders disabled input', () => {
  render(
    <GroupDisabledInput {...props} />,
  )

  const input = screen.getByTestId('group-disabled-input')
  expect(input).toBeInTheDocument()
  expect(input).toBeDisabled()
})

test('calls onChange with group data when available', () => {
  render(
    <GroupDisabledInput {...props} />,
  )

  expect(props.onChange).nthCalledWith(1, mockDocTypesGroupResponse.data.group)
})

test('does not call onChange in case value is provided', () => {
  render(
    <GroupDisabledInput
      {...props}
      value={mockDocTypesGroupResponse.data.group}
    />,
  )

  expect(props.onChange).not.toBeCalled()
})

test('does not call onChange in case there are no group data', () => {
  useFetchDocumentTypesGroupQuery.mockReturnValue({
    data: null,
  })

  render(
    <GroupDisabledInput
      {...props}
      value={mockDocTypesGroupResponse.data.group}
    />,
  )

  expect(props.onChange).not.toBeCalled()
})
