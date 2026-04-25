
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLayoutMutation } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { ImageLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { ImageField } from './ImageField'

jest.mock('@/utils/string', () => ({
  getUrlWithOrigin: jest.fn((url) => url),
}))

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/InView', () => ({
  InView: jest.fn(({ children }) => (
    <div data-testid="inview-mock">{children}</div>
  )),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ documentId: 'test-doc-id' }),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({
    state: 'inReview',
  }),
}))

const mockUpdateImage = jest.fn().mockResolvedValue({})

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutMutation: jest.fn(() => ({
    isEditable: true,
    updateImage: mockUpdateImage,
  })),
}))

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useUpdateImageMutation: jest.fn().mockReturnValue([
    jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) }),
    { isLoading: false },
  ]),
}))

const mockImageUrl = 'http://sample.png'
const mockImage = new Image()
mockImage.src = mockImageUrl

jest.mock('@/utils/image', () => ({
  loadImageURL: jest.fn(() => Promise.resolve(mockImage)),
}))

const mockTitle = 'image title'
const mockDescription = 'image description'

const mockImageDocumentLayout = new ImageLayout({
  id: 'mockId',
  order: 1,
  title: mockTitle,
  description: mockDescription,
  filePath: 'mockPath',
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const TEST_ID = {
  IMAGE: 'image',
  TITLE_LONG_TEXT: 'title-long-text',
  TITLE_INPUT: 'title-input',
  DESCRIPTION_TEXT_AREA: 'description-text-area',
  DESCRIPTION_TEXT: 'description-text',
}

const defaultProps = {
  imageLayout: mockImageDocumentLayout,
  isExpanded: false,
  onClick: jest.fn(),
  pageId: 'mockPageId',
  parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('displays image itself when it was loaded', async () => {
  render(<ImageField {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.IMAGE)).toBeInTheDocument()
  })
})

test('displays image title when image was loaded', async () => {
  render(<ImageField {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.TITLE_LONG_TEXT)).toBeInTheDocument()
  })
})

test('displays image description when user hovers the image', async () => {
  render(<ImageField {...defaultProps} />)

  await userEvent.hover(screen.getByTestId(TEST_ID.IMAGE))

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(mockDescription)
  })
})

test('shows title as text when not expanded', async () => {
  render(<ImageField {...defaultProps} />)

  await waitFor(() => {
    expect(screen.queryByTestId(TEST_ID.TITLE_INPUT)).not.toBeInTheDocument()
  })

  expect(screen.getByTestId(TEST_ID.TITLE_LONG_TEXT)).toBeInTheDocument()
})

test('shows description in tooltip when not expanded', async () => {
  render(<ImageField {...defaultProps} />)

  await userEvent.hover(screen.getByTestId(TEST_ID.IMAGE))

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(mockDescription)
  })

  expect(screen.queryByTestId(TEST_ID.DESCRIPTION_TEXT_AREA)).not.toBeInTheDocument()
})

test('calls onClick when image field is clicked', async () => {
  const onClickMock = jest.fn()

  render(
    <ImageField
      {...defaultProps}
      onClick={onClickMock}
    />,
  )

  await userEvent.click(screen.getByTestId('image-field-wrapper'))

  expect(onClickMock).toHaveBeenCalled()
})

test('does not show description when not expanded', async () => {
  render(<ImageField {...defaultProps} />)

  await waitFor(() => {
    expect(screen.queryByTestId(TEST_ID.DESCRIPTION_TEXT)).not.toBeInTheDocument()
  })

  expect(screen.queryByTestId(TEST_ID.DESCRIPTION_TEXT_AREA)).not.toBeInTheDocument()
})

test('shows description when expanded', async () => {
  render(
    <ImageField
      {...defaultProps}
      isExpanded={true}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.DESCRIPTION_TEXT_AREA)).toBeInTheDocument()
  })
})

test('renders editable title input when the component is expanded and editing is allowed', async () => {
  render(
    <ImageField
      {...defaultProps}
      isExpanded={true}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.TITLE_INPUT)).toBeInTheDocument()
  })
})

test('calls updateImage with correct data when title is changed and blurred', async () => {
  const props = {
    ...defaultProps,
    isExpanded: true,
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
  }

  render(<ImageField {...props} />)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.TITLE_INPUT)).toBeInTheDocument()
  })

  const titleInput = screen.getByTestId(TEST_ID.TITLE_INPUT)
  await userEvent.clear(titleInput)
  await userEvent.type(titleInput, 'New Title')
  await userEvent.tab()

  await waitFor(() => {
    expect(mockUpdateImage).toHaveBeenCalledWith({
      pageId: props.pageId,
      imageId: mockImageDocumentLayout.id,
      body: {
        title: 'New Title',
      },
    })
  })
})

test('does not call updateImage when title is blurred without changes', async () => {
  const props = {
    ...defaultProps,
    isExpanded: true,
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
  }

  render(<ImageField {...props} />)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.TITLE_INPUT)).toBeInTheDocument()
  })

  const titleInput = screen.getByTestId(TEST_ID.TITLE_INPUT)
  await userEvent.click(titleInput)
  await userEvent.tab()

  expect(mockUpdateImage).not.toHaveBeenCalled()
})

test('calls updateImage with correct data when description is changed and blurred', async () => {
  const props = {
    ...defaultProps,
    isExpanded: true,
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
  }

  render(<ImageField {...props} />)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.DESCRIPTION_TEXT_AREA)).toBeInTheDocument()
  })

  const descriptionTextArea = screen.getByTestId(TEST_ID.DESCRIPTION_TEXT_AREA)
  await userEvent.clear(descriptionTextArea)
  await userEvent.type(descriptionTextArea, 'New Description')
  await userEvent.tab()

  await waitFor(() => {
    expect(mockUpdateImage).toHaveBeenCalledWith({
      pageId: props.pageId,
      imageId: mockImageDocumentLayout.id,
      body: {
        description: 'New Description',
      },
    })
  })
})

test('does not call updateImage when description is blurred without changes', async () => {
  const props = {
    ...defaultProps,
    isExpanded: true,
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
  }

  render(<ImageField {...props} />)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.DESCRIPTION_TEXT_AREA)).toBeInTheDocument()
  })

  const descriptionTextArea = screen.getByTestId(TEST_ID.DESCRIPTION_TEXT_AREA)
  await userEvent.click(descriptionTextArea)
  await userEvent.tab()

  expect(mockUpdateImage).not.toHaveBeenCalled()
})

test('renders description as text when expanded and not editable', async () => {
  useLayoutMutation.mockReturnValue({
    isEditable: false,
    updateImage: mockUpdateImage,
  })

  const props = {
    ...defaultProps,
    isExpanded: true,
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
  }

  render(<ImageField {...props} />)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.DESCRIPTION_TEXT)).toBeInTheDocument()
  })

  expect(screen.queryByTestId(TEST_ID.DESCRIPTION_TEXT_AREA)).not.toBeInTheDocument()
  expect(screen.getByTestId(TEST_ID.DESCRIPTION_TEXT)).toHaveTextContent(mockDescription)
})

test('renders title as text when not editable', async () => {
  useLayoutMutation.mockReturnValue({
    isEditable: false,
    updateImage: mockUpdateImage,
  })

  const props = {
    ...defaultProps,
    isExpanded: true,
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
  }

  render(<ImageField {...props} />)

  await waitFor(() => {
    expect(screen.getByTestId(TEST_ID.TITLE_LONG_TEXT)).toBeInTheDocument()
  })

  expect(screen.queryByTestId(TEST_ID.TITLE_INPUT)).not.toBeInTheDocument()
})
