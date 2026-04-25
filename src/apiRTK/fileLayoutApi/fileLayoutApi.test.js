
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useFetchFileLayoutQuery,
  useFetchFileParsingInfoQuery,
  useCreateUserFileLayoutMutation,
  useUpdateFileParagraphMutation,
  useUpdateFileImageMutation,
  useUpdateFileTableMutation,
  useUpdateFileKeyValuePairMutation,
} from './fileLayoutApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })
      return {
        useFetchFileLayoutQuery: jest.fn(() => [jest.fn((args) => res.fetchFileLayout(args))]),
        useFetchFileParsingInfoQuery: jest.fn(() => [jest.fn((args) => res.fetchFileParsingInfo(args))]),
        useCreateUserFileLayoutMutation: jest.fn(() => [jest.fn((args) => res.createUserFileLayout(args))]),
        useUpdateFileParagraphMutation: jest.fn(() => [jest.fn((args) => res.updateFileParagraph(args))]),
        useUpdateFileImageMutation: jest.fn(() => [jest.fn((args) => res.updateFileImage(args))]),
        useUpdateFileTableMutation: jest.fn(() => [jest.fn((args) => res.updateFileTable(args))]),
        useUpdateFileKeyValuePairMutation: jest.fn(() => [jest.fn((args) => res.updateFileKeyValuePair(args))]),
      }
    },
  },
}))

const mockFileId = 'mock-file-id'
const mockPageId = 'mock-page-id'
const mockParagraphId = 'mock-paragraph-id'
const mockImageId = 'mock-image-id'
const mockTableId = 'mock-table-id'
const mockKeyValuePairId = 'mock-key-value-pair-id'

describe('useFetchFileLayoutQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const fileId = 'mockFileId'
    const parsingParams = { features: ['tables', 'text'] }

    const { result } = renderHook(() => useFetchFileLayoutQuery({
      fileId,
      ...parsingParams,
    }))
    await waitFor(() => {
      expect(result.current[0]({
        fileId,
        ...parsingParams,
      })).toEqual(
        apiMap.apiGatewayV2.v5.files.file.documentLayout(fileId, parsingParams),
      )
    })
  })

  test('calls endpoint without parsing params', async () => {
    const fileId = 'mockFileId'

    const { result } = renderHook(() => useFetchFileLayoutQuery({ fileId }))
    await waitFor(() => {
      expect(result.current[0]({ fileId })).toEqual(
        apiMap.apiGatewayV2.v5.files.file.documentLayout(fileId, {}),
      )
    })
  })
})

describe('useFetchFileParsingInfoQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const fileId = 'mockFileId'

    const { result } = renderHook(() => useFetchFileParsingInfoQuery(fileId))
    await waitFor(() => {
      expect(result.current[0](fileId)).toEqual(
        apiMap.apiGatewayV2.v5.files.file.parsingInfo(fileId),
      )
    })
  })
})

describe('useCreateUserFileLayoutMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const parsingType = 'custom-parsing-type'

    const { result } = renderHook(() => useCreateUserFileLayoutMutation())

    await waitFor(() => {
      expect(result.current[0]({
        fileId: mockFileId,
        parsingType,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.userParsingType(mockFileId),
        method: RequestMethod.PUT,
        body: {
          parsingType,
        },
      })
    })
  })
})

describe('useUpdateFileParagraphMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const body = { content: 'updated content' }

    const { result } = renderHook(() => useUpdateFileParagraphMutation())

    await waitFor(() => {
      expect(result.current[0]({
        fileId: mockFileId,
        pageId: mockPageId,
        paragraphId: mockParagraphId,
        body,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.pages.page.paragraphs.paragraph(
          mockFileId,
          mockPageId,
          mockParagraphId,
        ),
        method: RequestMethod.PATCH,
        body,
      })
    })
  })
})

describe('useUpdateFileImageMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const body = { description: 'updated description' }

    const { result } = renderHook(() => useUpdateFileImageMutation())

    await waitFor(() => {
      expect(result.current[0]({
        fileId: mockFileId,
        pageId: mockPageId,
        imageId: mockImageId,
        body,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.pages.page.images.image(
          mockFileId,
          mockPageId,
          mockImageId,
        ),
        method: RequestMethod.PATCH,
        body,
      })
    })
  })
})

describe('useUpdateFileTableMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const body = { data: [[{ text: 'cell content' }]] }

    const { result } = renderHook(() => useUpdateFileTableMutation())

    await waitFor(() => {
      expect(result.current[0]({
        fileId: mockFileId,
        pageId: mockPageId,
        tableId: mockTableId,
        body,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.pages.page.tables.table(
          mockFileId,
          mockPageId,
          mockTableId,
        ),
        method: RequestMethod.PATCH,
        body,
      })
    })
  })
})

describe('useUpdateFileKeyValuePairMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const body = {
      key: 'updated key',
      value: 'updated value',
    }

    const { result } = renderHook(() => useUpdateFileKeyValuePairMutation())

    await waitFor(() => {
      expect(result.current[0]({
        fileId: mockFileId,
        pageId: mockPageId,
        keyValuePairId: mockKeyValuePairId,
        body,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.files.file.documentLayout.pages.page.keyValuePairs.keyValuePair(
          mockFileId,
          mockPageId,
          mockKeyValuePairId,
        ),
        method: RequestMethod.PATCH,
        body,
      })
    })
  })
})
