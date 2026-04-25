
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useFetchDocumentLayoutQuery,
  useFetchParsingInfoQuery,
  useCreateUserDocumentLayoutMutation,
  useUpdateParagraphMutation,
  useUpdateImageMutation,
  useUpdateTableMutation,
  useUpdateKeyValuePairMutation,
} from './documentLayoutApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })
      return {
        useFetchDocumentLayoutQuery: jest.fn(() => [jest.fn((args) => res.fetchDocumentLayout(args))]),
        useFetchParsingInfoQuery: jest.fn(() => [jest.fn((args) => res.fetchParsingInfo(args))]),
        useCreateUserDocumentLayoutMutation: jest.fn(() => [jest.fn((args) => res.createUserDocumentLayout(args))]),
        useUpdateParagraphMutation: jest.fn(() => [jest.fn((args) => res.updateParagraph(args))]),
        useUpdateImageMutation: jest.fn(() => [jest.fn((args) => res.updateImage(args))]),
        useUpdateTableMutation: jest.fn(() => [jest.fn((args) => res.updateTable(args))]),
        useUpdateKeyValuePairMutation: jest.fn(() => [jest.fn((args) => res.updateKeyValuePair(args))]),
      }
    },
  },
}))

describe('useFetchDocumentLayoutQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const documentId = 'mockId'

    const { result } = renderHook(() => useFetchDocumentLayoutQuery({ documentId }))
    await waitFor(() => {
      expect(result.current[0]({ documentId })).toEqual(
        apiMap.apiGatewayV2.v5.documents.document.documentLayout(documentId, {}),
      )
    })
  })
})

describe('useFetchParsingInfoQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const documentId = 'mockId'

    const { result } = renderHook(() => useFetchParsingInfoQuery(documentId))
    await waitFor(() => {
      expect(result.current[0](documentId)).toEqual(
        apiMap.apiGatewayV2.v5.documents.document.parsingInfo(documentId),
      )
    })
  })
})

test('useCreateUserDocumentLayoutMutation works correctly', async () => {
  const mockId = 'mockId'

  const { result } = renderHook(() => useCreateUserDocumentLayoutMutation())
  const trigger = result.current[0]

  await waitFor(() => {
    expect(trigger({
      documentId: mockId,
      parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.AWS_TEXTRACT,
    })).toEqual({
      url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.userParsingType(mockId),
      method: RequestMethod.PUT,
      body: {
        parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.AWS_TEXTRACT,
      },
    })
  })
})

test('useUpdateParagraphMutation works correctly', async () => {
  const mockId = 'mockId'
  const mockPageId = 1
  const mockParagraphId = 'mockParagraphId'
  const mockParagraph = { content: 'Test content' }

  const { result } = renderHook(() => useUpdateParagraphMutation())
  const trigger = result.current[0]

  await waitFor(() => {
    expect(
      trigger({
        documentId: mockId,
        pageId: mockPageId,
        paragraphId: mockParagraphId,
        body: mockParagraph,
      }),
    ).toEqual({
      url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.pages.page.paragraphs.paragraph(
        mockId,
        mockPageId,
        mockParagraphId,
      ),
      method: RequestMethod.PATCH,
      body: mockParagraph,
    })
  })
})

test('useUpdateImageMutation works correctly', async () => {
  const mockId = 'mockId'
  const mockPageId = 'mockPageId'
  const mockImageId = 'mockImageId'
  const mockImageBody = {
    title: 'Test image title',
    description: 'Test image description',
  }

  const { result } = renderHook(() => useUpdateImageMutation())
  const trigger = result.current[0]

  await waitFor(() => {
    expect(
      trigger({
        documentId: mockId,
        pageId: mockPageId,
        imageId: mockImageId,
        body: mockImageBody,
      }),
    ).toEqual({
      url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.pages.page.images.image(
        mockId,
        mockPageId,
        mockImageId,
      ),
      method: RequestMethod.PATCH,
      body: mockImageBody,
    })
  })
})

test('useUpdateTableMutation works correctly', async () => {
  const mockId = 'mockId'
  const mockPageId = 'mockPageId'
  const mockTableId = 'mockTableId'
  const mockTableBody = {
    cells: [{
      content: 'Test cell content',
      rowIndex: 0,
      columnIndex: 0,
    }],
  }

  const { result } = renderHook(() => useUpdateTableMutation())
  const trigger = result.current[0]

  await waitFor(() => {
    expect(
      trigger({
        documentId: mockId,
        pageId: mockPageId,
        tableId: mockTableId,
        body: mockTableBody,
      }),
    ).toEqual({
      url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.pages.page.tables.table(
        mockId,
        mockPageId,
        mockTableId,
      ),
      method: RequestMethod.PATCH,
      body: mockTableBody,
    })
  })
})

test('useUpdateKeyValuePairMutation works correctly', async () => {
  const mockId = 'mockId'
  const mockPageId = 'mockPageId'
  const mockKeyValuePairId = 'mockKeyValuePairId'
  const mockKeyValuePairBody = {
    key: 'Test key',
    value: 'Test value',
  }

  const { result } = renderHook(() => useUpdateKeyValuePairMutation())
  const trigger = result.current[0]

  await waitFor(() => {
    expect(
      trigger({
        documentId: mockId,
        pageId: mockPageId,
        keyValuePairId: mockKeyValuePairId,
        body: mockKeyValuePairBody,
      }),
    ).toEqual({
      url: apiMap.apiGatewayV2.v5.documents.document.documentLayout.pages.page.keyValuePairs.keyValuePair.patch(
        mockId,
        mockPageId,
        mockKeyValuePairId,
      ),
      method: RequestMethod.PATCH,
      body: mockKeyValuePairBody,
    })
  })
})
