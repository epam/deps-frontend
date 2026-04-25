
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { renderHook } from '@testing-library/react-hooks'
import { startReview } from '@/actions/documentReviewPage'
import { Modal } from '@/components/Modal'
import { useLayoutData } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { DocumentState } from '@/enums/DocumentState'
import { FileStatus } from '@/enums/FileStatus'
import { localize, Localization } from '@/localization/i18n'
import { useLayoutEditAction } from './useLayoutEditAction'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => mockReactRedux)

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ documentId: 'doc123' })),
}))

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutData: jest.fn(() => mockUseLayoutData),
  LAYOUT_TYPE_TO_ENTITY_ID_KEY: {
    document: 'documentId',
    file: 'fileId',
  },
}))

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useCreateUserDocumentLayoutMutation: jest.fn(() => [
    mockCreateUserDocumentLayout,
  ]),
}))

jest.mock('@/apiRTK/fileLayoutApi', () => ({
  useCreateUserFileLayoutMutation: jest.fn(() => [
    mockCreateUserFileLayout,
  ]),
}))

jest.mock('@/components/Modal', () => ({
  Modal: {
    confirm: jest.fn(({ onOk }) => {
      onOk?.()
      return { destroy: jest.fn() }
    }),
  },
}))

jest.mock('@/actions/documentReviewPage', () => ({
  startReview: jest.fn(),
}))

const mockCreateUserDocumentLayout = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({}),
}))

const mockCreateUserFileLayout = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({}),
}))

const mockUseLayoutData = {
  layoutId: 'doc123',
  layoutType: 'document',
  isFile: false,
  file: null,
  document: {
    _id: 'doc123',
    state: DocumentState.IN_REVIEW,
  },
}

const mockParsingInfoData = {
  documentLayoutInfo: {
    parsingFeatures: {
      TESSERACT: ['text'],
    },
  },
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('creates editable copy directly for IN_REVIEW document when no USER_DEFINED copy exists', async () => {
  const { result } = renderHook(() => useLayoutEditAction(mockParsingInfoData))

  const done = await result.current.handleEditAction(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  expect(mockCreateUserDocumentLayout).toHaveBeenCalledWith({
    documentId: 'doc123',
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
  })

  expect(done).toBe(true)

  expect(Modal.confirm).not.toHaveBeenCalled()
})

test('shows confirmation dialog when document is in COMPLETED state', async () => {
  useLayoutData.mockReturnValueOnce({
    ...mockUseLayoutData,
    document: {
      ...mockUseLayoutData.document,
      state: DocumentState.COMPLETED,
    },
  })

  const { result } = renderHook(() => useLayoutEditAction(mockParsingInfoData))

  await result.current.handleEditAction(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  expect(Modal.confirm).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Start Review to Create Editable Copy',
      content: 'This document is not currently in the \'In Review\' state. By clicking \'Confirm,\' you will initiate the review process.',
    }),
  )

  expect(startReview).toHaveBeenCalledWith('doc123')

  expect(mockCreateUserDocumentLayout).toHaveBeenCalled()
})

test('shows confirmation dialog when USER_DEFINED parsing type exists', async () => {
  const rawParsingInfoData = {
    documentLayoutInfo: {
      parsingFeatures: {
        USER_DEFINED: ['text', 'tables'],
        TESSERACT: ['text'],
      },
    },
  }

  const { result } = renderHook(() => useLayoutEditAction(rawParsingInfoData))

  await result.current.handleEditAction(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  expect(Modal.confirm).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Replace Existing Copy',
    }),
  )

  expect(mockCreateUserDocumentLayout).toHaveBeenCalled()
})

test('handles cancel from confirmation dialog', async () => {
  useLayoutData.mockReturnValueOnce({
    ...mockUseLayoutData,
    document: {
      ...mockUseLayoutData.document,
      state: DocumentState.COMPLETED,
    },
  })

  Modal.confirm.mockImplementationOnce(({ onCancel }) => {
    onCancel && onCancel()
    return { destroy: jest.fn() }
  })

  const { result } = renderHook(() => useLayoutEditAction(mockParsingInfoData))

  const done = await result.current.handleEditAction(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  expect(done).toBe(false)

  expect(mockCreateUserDocumentLayout).not.toHaveBeenCalled()
})

test('creates editable copy directly when parsingInfoData exists but documentLayoutInfo is null', async () => {
  const rawParsingInfoData = {
    documentLayoutInfo: null,
  }

  const { result } = renderHook(() => useLayoutEditAction(rawParsingInfoData))

  const done = await result.current.handleEditAction(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  expect(mockCreateUserDocumentLayout).toHaveBeenCalledWith({
    documentId: 'doc123',
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
  })

  expect(done).toBe(true)

  expect(Modal.confirm).not.toHaveBeenCalled()
})

test('does not show Start Review modal for files', async () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: 'file123',
    layoutType: 'file',
    isFile: true,
    file: {
      id: 'file123',
      state: {
        status: FileStatus.COMPLETED,
      },
    },
    document: null,
  })

  const { result } = renderHook(() => useLayoutEditAction(mockParsingInfoData))

  const done = await result.current.handleEditAction(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT)

  expect(Modal.confirm).not.toHaveBeenCalledWith(
    expect.objectContaining({
      title: localize(Localization.COPY_FOR_EDITING_CONFIRM_TITLE),
    }),
  )

  expect(mockCreateUserFileLayout).toHaveBeenCalledWith({
    fileId: 'file123',
    parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
  })

  expect(done).toBe(true)
  expect(startReview).not.toHaveBeenCalled()
})
