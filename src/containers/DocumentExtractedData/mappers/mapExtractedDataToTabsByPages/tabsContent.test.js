
import { mockEnv } from '@/mocks/mockEnv'
import {
  cleanup,
  screen,
} from '@testing-library/react'
import { FileExtension } from '@/enums/FileExtension'
import { Document, File } from '@/models/Document'
import { render } from '@/utils/rendererRTL'
import {
  mockDataWithFieldCoordinates,
  mockDataWithKeyValuePairsFieldCoordinates,
  mockDataWithListFieldCoordinates,
  mockDataWithFieldSourceBboxCoordinates,
  mockDataWithFieldSourceTableCoordinates,
  mockDataWithFieldTableCoordinates,
} from '../__mocks__'
import { mapExtractedDataToTabsByPages } from './mapExtractedDataToTabsByPages'

const MockDocumentFields = ({ fields }) => (
  <ul>
    {
      fields.map((field) => (
        <li key={field.fieldPk}>
          {field.fieldPk}
        </li>
      ))
    }
  </ul>
)

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DocumentFields', () => ({
  DocumentFields: (props) => <MockDocumentFields {...props} />,
}))

const mockDocument = new Document({
  id: 'testDocId',
  extractedData: [],
  files: [
    new File(
      'url' + FileExtension.PDF,
      'blobName',
    ),
  ],
})

const checkTabsContent = (tabs, fieldFromPage1, fieldFromPage2) => {
  const [{ children: tab1Children }, { children: tab2Children }] = tabs

  render(
    tab1Children,
  )

  expect(screen.getByText(fieldFromPage1.fieldPk)).toBeInTheDocument()
  expect(screen.queryByText(fieldFromPage2.fieldPk)).not.toBeInTheDocument()

  cleanup()

  render(
    tab2Children,
  )

  expect(screen.queryByText(fieldFromPage1.fieldPk)).not.toBeInTheDocument()
  expect(screen.getByText(fieldFromPage2.fieldPk)).toBeInTheDocument()
}

test('should group extracted data fields by page and render them in correct tab if fields have array of coordinates', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromPage1, fieldFromPage2] } = mockDataWithFieldCoordinates

  const tabs = mapExtractedDataToTabsByPages({
    document: {
      ...mockDocument,
      extractedData: [fieldFromPage1, fieldFromPage2],
    },
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  checkTabsContent(tabs, fieldFromPage1, fieldFromPage2)
})

test('should group extracted data fields by page and render them in correct tab if fields have key value pair type', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromPage1, fieldFromPage2] } = mockDataWithKeyValuePairsFieldCoordinates

  const tabs = mapExtractedDataToTabsByPages({
    document: {
      ...mockDocument,
      extractedData: [fieldFromPage1, fieldFromPage2],
    },
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  checkTabsContent(tabs, fieldFromPage1, fieldFromPage2)
})

test('should group extracted data fields by page and render them in correct tab if fields have list type', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromPage1, fieldFromPage2] } = mockDataWithListFieldCoordinates

  const tabs = mapExtractedDataToTabsByPages({
    document: {
      ...mockDocument,
      extractedData: [fieldFromPage1, fieldFromPage2],
    },
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  checkTabsContent(tabs, fieldFromPage1, fieldFromPage2)
})

test('should group extracted data fields by page and render them in correct tab if fields have array of sourceBboxCoordinates', () => {
  const page1 = 1
  const page2 = 2
  const sourceId1 = 'sourceId1'
  const sourceId2 = 'sourceId2'
  const { mockDocumentType, mockExtractedData: [fieldFromPage1, fieldFromPage2] } = mockDataWithFieldSourceBboxCoordinates

  const tabs = mapExtractedDataToTabsByPages({
    document: {
      ...mockDocument,
      extractedData: [fieldFromPage1, fieldFromPage2],
      unifiedData: {
        1: [{
          id: sourceId1,
          page: page1,
        }],
        2: [{
          id: sourceId2,
          page: page2,
        }],
      },
    },
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  checkTabsContent(tabs, fieldFromPage1, fieldFromPage2)
})

test('should group extracted data fields by page and render them in correct tab if fields have array of sourceTableCoordinates', () => {
  const page1 = 1
  const page2 = 2
  const sourceId1 = 'sourceId1'
  const sourceId2 = 'sourceId2'
  const { mockDocumentType, mockExtractedData: [fieldFromPage1, fieldFromPage2] } = mockDataWithFieldSourceTableCoordinates

  const tabs = mapExtractedDataToTabsByPages({
    document: {
      ...mockDocument,
      extractedData: [fieldFromPage1, fieldFromPage2],
      unifiedData: {
        1: [{
          id: sourceId1,
          page: page1,
        }],
        2: [{
          id: sourceId2,
          page: page2,
        }],
      },
    },
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  checkTabsContent(tabs, fieldFromPage1, fieldFromPage2)
})

test('should group extracted data fields by page and render them in correct tab if fields have array of tableCoordinates', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromPage1, fieldFromPage2] } = mockDataWithFieldTableCoordinates

  const tabs = mapExtractedDataToTabsByPages({
    document: {
      ...mockDocument,
      extractedData: [fieldFromPage1, fieldFromPage2],
    },
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  checkTabsContent(tabs, fieldFromPage1, fieldFromPage2)
})
