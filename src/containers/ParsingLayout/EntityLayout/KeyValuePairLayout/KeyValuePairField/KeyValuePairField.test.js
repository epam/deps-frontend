
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLayoutMutation } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { DocumentState } from '@/enums/DocumentState'
import { KeyValuePairElementLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { KeyValuePairField } from './KeyValuePairField'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) => selector === undefined ? mockDocument : selector(mockDocument)),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ documentId: 'docId' }),
}))

jest.mock('@/actions/documentReviewPage', () => ({
  highlightPolygonCoordsField: jest.fn(),
}))

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useUpdateKeyValuePairMutation: () => [mockUpdateKeyValuePair],
}))

jest.mock('@/selectors/documentReviewPage', () => ({
  documentSelector: () => mockDocument,
}))

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutMutation: jest.fn(() => ({
    isEditable: true,
    updateKeyValuePair: mockUpdateKeyValuePair,
  })),
  useHighlightCoords: jest.fn(() => ({
    highlightCoords: mockHighlightCoords,
  })),
}))

const mockKeyData = new KeyValuePairElementLayout(
  'keyContent',
  [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
)

const mockValueData = new KeyValuePairElementLayout(
  'valueContent',
  [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
)

const mockDocument = { state: DocumentState.IN_REVIEW }
const mockDispatch = jest.fn()
const mockUpdateKeyValuePair = jest.fn().mockResolvedValue({})
const mockHighlightCoords = jest.fn()

const defaultProps = {
  page: 1,
  keyData: mockKeyData,
  valueData: mockValueData,
  keyValuePairId: 'kvpId',
  pageId: 'pageId',
  parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders correct layout (both key and value)', () => {
  render(<KeyValuePairField {...defaultProps} />)
  expect(screen.getByTestId('key-input')).toBeInTheDocument()
  expect(screen.getByTestId('value-input')).toBeInTheDocument()
  expect(screen.getByTestId('key-icon-btn')).toBeInTheDocument()
  expect(screen.getByTestId('value-icon-btn')).toBeInTheDocument()
})

test('calls highlightCoords with correct args on key icon click', async () => {
  render(<KeyValuePairField {...defaultProps} />)

  await userEvent.click(screen.getByTestId('key-icon-btn'))

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockKeyData.polygon],
    page: defaultProps.page,
  })
})

test('calls highlightCoords with correct args on value icon click', async () => {
  render(<KeyValuePairField {...defaultProps} />)

  await userEvent.click(screen.getByTestId('value-icon-btn'))

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockValueData.polygon],
    page: defaultProps.page,
  })
})

test('renders only one input if value data is not provided', () => {
  render(
    <KeyValuePairField
      {...defaultProps}
      valueData={null}
    />,
  )

  expect(screen.getByTestId('key-input')).toBeInTheDocument()
  expect(screen.queryByTestId('value-input')).not.toBeInTheDocument()
})

test('calls updateKeyValuePair on key blur if content changed', async () => {
  render(<KeyValuePairField {...defaultProps} />)

  const keyInput = screen.getByTestId('key-input')

  await userEvent.click(keyInput)
  await userEvent.clear(keyInput)
  await userEvent.type(keyInput, 'newKey')
  await userEvent.tab()

  expect(mockUpdateKeyValuePair).toHaveBeenCalledWith({
    pageId: 'pageId',
    keyValuePairId: 'kvpId',
    body: {
      key: {
        content: 'newKey',
      },
      value: {
        content: 'valueContent',
      },
    },
  })
})

test('calls updateKeyValuePair on value blur if content changed', async () => {
  render(<KeyValuePairField {...defaultProps} />)

  const valueInput = screen.getByTestId('value-input')

  await userEvent.click(valueInput)
  await userEvent.clear(valueInput)
  await userEvent.type(valueInput, 'newValue')
  await userEvent.tab()

  expect(mockUpdateKeyValuePair).toHaveBeenCalledWith({
    pageId: 'pageId',
    keyValuePairId: 'kvpId',
    body: {
      key: {
        content: 'keyContent',
      },
      value: {
        content: 'newValue',
      },
    },
  })
})

test('does not call updateKeyValuePair on key blur if content did not change', async () => {
  render(<KeyValuePairField {...defaultProps} />)

  const keyInput = screen.getByTestId('key-input')

  await userEvent.click(keyInput)
  await userEvent.tab()

  expect(mockUpdateKeyValuePair).not.toHaveBeenCalled()
})

test('does not call updateKeyValuePair on value blur if content did not change', async () => {
  render(<KeyValuePairField {...defaultProps} />)

  const valueInput = screen.getByTestId('value-input')

  await userEvent.click(valueInput)
  await userEvent.tab()

  expect(mockUpdateKeyValuePair).not.toHaveBeenCalled()
})

test('inputs are enabled when isEditable is true', () => {
  render(
    <KeyValuePairField
      {...defaultProps}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED}
    />,
  )
  expect(screen.getByTestId('key-input')).not.toBeDisabled()
  expect(screen.getByTestId('value-input')).not.toBeDisabled()
})

test('inputs are disabled when isEditable is false', () => {
  useLayoutMutation.mockReturnValueOnce({
    isEditable: false,
    updateKeyValuePair: mockUpdateKeyValuePair,
  })

  render(
    <KeyValuePairField
      {...defaultProps}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT}
    />,
  )
  expect(screen.getByTestId('key-input')).toBeDisabled()
  expect(screen.getByTestId('value-input')).toBeDisabled()
})

test('calls updateKeyValuePair with undefined value when key is changed and valueData is null', async () => {
  const props = {
    ...defaultProps,
    valueData: null,
  }

  render(<KeyValuePairField {...props} />)

  const keyInput = screen.getByTestId('key-input')

  await userEvent.click(keyInput)
  await userEvent.clear(keyInput)
  await userEvent.type(keyInput, 'newKey')
  await userEvent.tab()

  expect(mockUpdateKeyValuePair).toHaveBeenCalledWith({
    pageId: 'pageId',
    keyValuePairId: 'kvpId',
    body: {
      key: {
        content: 'newKey',
      },
      value: undefined,
    },
  })
})
