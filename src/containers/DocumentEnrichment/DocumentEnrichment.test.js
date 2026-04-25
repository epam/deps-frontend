
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import {
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { useFetchSupplementsQuery } from '@/apiRTK/documentSupplementsApi'
import { DocumentState } from '@/enums/DocumentState'
import { FieldType } from '@/enums/FieldType'
import { StatusCode } from '@/enums/StatusCode'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DocumentEnrichment } from './DocumentEnrichment'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

const mockExtraFields = [
  new DocumentTypeExtraField({
    code: 'mockExtraFieldCode1',
    name: 'mockExtraFieldName1',
    order: 0,
  }),
  new DocumentTypeExtraField({
    code: 'mockExtraFieldCode2',
    name: 'mockExtraFieldName2',
    order: 1,
  }),
]

jest.mock('@/components/Icons/PlusFilledIcon', () => ({
  PlusFilledIcon: () => <span />,
}))

const mockSupplementValue = 'mockSupplementValue'

const mockSupplements = [
  new DocumentSupplement({
    code: 'mockSupplementCode',
    name: 'mockSupplementName',
    type: FieldType.STRING,
    value: mockSupplementValue,
  }),
]

const mockCreateOrUpdateSupplementsFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentSupplementsApi', () => ({
  useFetchSupplementsQuery: jest.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useCreateOrUpdateSupplementsMutation: jest.fn(() => ([
    mockCreateOrUpdateSupplementsFn,
    { isLoading: false },
  ])),
  useLazyFetchSupplementsQuery: jest.fn(() => ([
    jest.fn(),
    { isFetching: false },
  ])),
}))

const MOCK_TYPE_CODE = 'MOCK_TYPE_CODE'
const MOCK_DOCUMENT_ID = 'MOCK_DOCUMENT_ID'

test('shows spinner if data is fetching', async () => {
  useFetchSupplementsQuery.mockImplementationOnce(
    jest.fn(() => ({
      data: [],
      isLoading: true,
    })),
  )

  render(
    <DocumentEnrichment
      documentId={MOCK_DOCUMENT_ID}
      documentState={DocumentState.IN_REVIEW}
      documentTypeCode={MOCK_TYPE_CODE}
      documentTypeExtraFields={[]}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId('spin')).toBeInTheDocument()
  })
})

test('shows no data layout and info panel if there are no extra fields and supplements', async () => {
  useFetchSupplementsQuery.mockImplementationOnce(
    jest.fn(() => ({
      data: [],
      isLoading: false,
    })),
  )

  render(
    <DocumentEnrichment
      documentId={MOCK_DOCUMENT_ID}
      documentState={DocumentState.IN_REVIEW}
      documentTypeCode={MOCK_TYPE_CODE}
      documentTypeExtraFields={[]}
    />,
  )

  await waitFor(() => {
    expect(screen.getByText(localize(Localization.TOTAL_NUMBER))).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByText(localize(Localization.NOTHING_TO_DISPLAY))).toBeInTheDocument()
  })
})

test('calls notifyWarning if fetchSupplements has failed and status code is not 404', async () => {
  jest.clearAllMocks()

  useFetchSupplementsQuery.mockImplementationOnce(
    jest.fn(() => ({
      data: [],
      isLoading: false,
      error: new Error(''),
    })),
  )

  render(
    <DocumentEnrichment
      documentId={MOCK_DOCUMENT_ID}
      documentState={DocumentState.IN_REVIEW}
      documentTypeCode={MOCK_TYPE_CODE}
      documentTypeExtraFields={[]}
    />,
  )

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })
})

test('should not call notifyWarning if fetchSupplements has failed with status code 404', async () => {
  jest.clearAllMocks()

  useFetchSupplementsQuery.mockImplementationOnce(
    jest.fn(() => ({
      data: [],
      isLoading: false,
      error: {
        status: StatusCode.NOT_FOUND,
      },
    })),
  )

  render(
    <DocumentEnrichment
      documentId={MOCK_DOCUMENT_ID}
      documentState={DocumentState.IN_REVIEW}
      documentTypeCode={MOCK_TYPE_CODE}
      documentTypeExtraFields={[]}
    />,
  )

  await waitFor(() => {
    expect(notifyWarning).not.toHaveBeenCalled()
  })
})

test('shows info panel correctly', async () => {
  jest.clearAllMocks()

  useFetchSupplementsQuery.mockImplementation(
    () => ({
      data: mockSupplements,
      isFetching: false,
    }),
  )

  render(
    <DocumentEnrichment
      documentId={MOCK_DOCUMENT_ID}
      documentState={DocumentState.IN_REVIEW}
      documentTypeCode={MOCK_TYPE_CODE}
      documentTypeExtraFields={[]}
    />,
  )

  const addFieldButton = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW_FIELD),
  })

  const totalNumber = screen.getByText(localize(Localization.TOTAL_NUMBER))

  await waitFor(() => {
    expect(totalNumber).toBeInTheDocument()
  })
  expect(within(totalNumber).getByText(mockSupplements.length)).toBeInTheDocument()
  expect(addFieldButton).toBeInTheDocument()
})

test('shows fields correctly', async () => {
  jest.clearAllMocks()

  useFetchSupplementsQuery.mockImplementation(
    () => ({
      data: mockSupplements,
      isFetching: false,
    }),
  )

  render(
    <DocumentEnrichment
      documentId={MOCK_DOCUMENT_ID}
      documentState={DocumentState.IN_REVIEW}
      documentTypeCode={MOCK_TYPE_CODE}
      documentTypeExtraFields={mockExtraFields}
    />,
  )

  await waitFor(() => {
    mockExtraFields.forEach((f) => {
      expect(screen.getByText(f.name)).toBeInTheDocument()
    })
  })

  await waitFor(() => {
    mockSupplements.forEach((f) => {
      expect(screen.getByText(f.name)).toBeInTheDocument()
    })
  })

  const expectedFieldsNumber = mockExtraFields.length + mockSupplements.length

  await waitFor(() => {
    const input = screen.getAllByRole('textbox')
    expect(input.length).toEqual(expectedFieldsNumber)
  })
})

test('fields and add field button are disabled if document is not in review state and has doc type assigned', async () => {
  jest.clearAllMocks()

  useFetchSupplementsQuery.mockImplementation(
    () => ({
      data: mockSupplements,
      isFetching: false,
    }),
  )

  render(
    <DocumentEnrichment
      documentId={MOCK_DOCUMENT_ID}
      documentState={DocumentState.NEW}
      documentTypeCode={MOCK_TYPE_CODE}
      documentTypeExtraFields={[]}
    />,
  )

  const addFieldButton = screen.getByRole('button', {
    name: localize(Localization.ADD_NEW_FIELD),
  })
  const field = screen.getByDisplayValue(mockSupplementValue)

  await waitFor(() => {
    expect(addFieldButton).toBeDisabled()
  })

  await waitFor(() => {
    expect(field).toBeDisabled()
  })
})
