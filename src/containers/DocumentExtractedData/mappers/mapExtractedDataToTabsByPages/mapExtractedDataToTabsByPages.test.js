
import { mockEnv } from '@/mocks/mockEnv'
import {
  cleanup,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileExtension } from '@/enums/FileExtension'
import { localize, Localization } from '@/localization/i18n'
import { Document, File } from '@/models/Document'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { render } from '@/utils/rendererRTL'
import { mockDataWithFieldCoordinates } from '../__mocks__'
import { mapExtractedDataToTabsByPages } from './mapExtractedDataToTabsByPages'

const MockDocumentFields = ({ fields }) => (
  <ul data-testid='document-fields'>
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

const UNMATCHED_FIELDS_KEY = 'unmatched_fields'
const page1 = 1
const page2 = 2
const pk2 = 'stringPk2'

const { mockDocumentType, mockExtractedData: [fieldFromPage1, fieldFromPage2] } = mockDataWithFieldCoordinates

test('should create Tab component with correct properties and content layout for every page', () => {
  const documentPages = [page1, page2]

  const tabs = mapExtractedDataToTabsByPages({
    document: new Document({
      id: 'testDocId',
      extractedData: [fieldFromPage1, fieldFromPage2],
      files: [
        new File(
          'url' + FileExtension.PDF,
          'blobName' + FileExtension.PDF,
        ),
      ],
    }),
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  expect(tabs).toHaveLength(documentPages.length)

  documentPages.forEach((page, i) => {
    const { label, children } = tabs[i]

    render(
      <>
        {label}
        {children}
      </>,
    )

    expect(tabs[i].key).toEqual(`${page}`)
    expect(screen.getByText(localize(Localization.PAGE_LABEL, { page }))).toBeInTheDocument()
    expect(screen.getByTestId('document-fields')).toBeInTheDocument()

    cleanup()
  })
})

test('should call highlightPolygonCoordsField with correct page number if user clicks on Tab title', async () => {
  const mockHighlightPolygonCoordsField = jest.fn()

  const [tab1, tab2] = mapExtractedDataToTabsByPages({
    document: new Document({
      id: 'testDocId',
      extractedData: [fieldFromPage1, fieldFromPage2],
      files: [
        new File(
          'url' + FileExtension.PDF,
          'blobName' + FileExtension.PDF,
        ),
      ],
    }),
    documentType: mockDocumentType,
    highlightPolygonCoordsField: mockHighlightPolygonCoordsField,
    highlightTableCoordsField: jest.fn(),
  })

  render(
    <>
      {tab1.label}
      {tab2.label}
    </>,
  )

  await userEvent.click(screen.getByText(localize(Localization.PAGE_LABEL, { page: page1 })))
  expect(mockHighlightPolygonCoordsField).nthCalledWith(1, { page: page1 })

  await userEvent.click(screen.getByText(localize(Localization.PAGE_LABEL, { page: page2 })))
  expect(mockHighlightPolygonCoordsField).nthCalledWith(2, { page: page2 })
})

test('should call highlightTableCoordsField with correct page number if document is a table and user clicks on Tab title', async () => {
  const mockTableDocument = new Document({
    id: 'testDocId',
    extractedData: [fieldFromPage1, fieldFromPage2],
    files: [
      new File(
        'url' + FileExtension.XLS,
        'blobName' + FileExtension.XLS,
      ),
    ],
  })

  const mockHighlightTableCoordsField = jest.fn()

  const [tab1, tab2] = mapExtractedDataToTabsByPages({
    document: mockTableDocument,
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: mockHighlightTableCoordsField,
  })

  render(
    <>
      {tab1.label}
      {tab2.label}
    </>,
  )

  await userEvent.click(screen.getByText(localize(Localization.PAGE_LABEL, { page: page1 })))
  expect(mockHighlightTableCoordsField).nthCalledWith(1, { page: page1 })

  await userEvent.click(screen.getByText(localize(Localization.PAGE_LABEL, { page: page2 })))
  expect(mockHighlightTableCoordsField).nthCalledWith(2, { page: page2 })
})

test('should create Unmatched Fields tab with correct content for extracted data fields with empty page', async () => {
  const fieldWithoutPage = new ExtractedDataField(
    pk2,
    new FieldData(
      'string',
      new FieldCoordinates(null, 1, 1, 2, 2),
    ),
  )

  const [, unmatchedFieldsTab] = mapExtractedDataToTabsByPages({
    document: new Document({
      id: 'testDocId',
      extractedData: [fieldFromPage1, fieldWithoutPage],
      files: [
        new File(
          'url' + FileExtension.PDF,
          'blobName' + FileExtension.PDF,
        ),
      ],
    }),
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  const { children: unmatchedFieldsContent } = unmatchedFieldsTab

  render(
    unmatchedFieldsContent,
  )

  expect(unmatchedFieldsTab.key).toEqual(UNMATCHED_FIELDS_KEY)
  expect(screen.getByText(fieldWithoutPage.fieldPk)).toBeInTheDocument()
  expect(screen.queryByText(fieldFromPage1.fieldPk)).not.toBeInTheDocument()
})

test('should create correct title and show tooltip on title hover for Unmatched Fields tab', async () => {
  const fieldWithoutPage = new ExtractedDataField(
    pk2,
    new FieldData(
      'string',
      new FieldCoordinates(null, 1, 1, 2, 2),
    ),
  )

  const [, unmatchedFieldsTab] = mapExtractedDataToTabsByPages({
    document: new Document({
      id: 'testDocId',
      extractedData: [fieldFromPage1, fieldWithoutPage],
      files: [
        new File(
          'url' + FileExtension.PDF,
          'blobName' + FileExtension.PDF,
        ),
      ],
    }),
    documentType: mockDocumentType,
    highlightPolygonCoordsField: jest.fn(),
    highlightTableCoordsField: jest.fn(),
  })

  render(
    unmatchedFieldsTab.label,
  )

  const title = screen.getByText(localize(Localization.UNMATCHED_FIELDS))
  expect(title).toBeInTheDocument()

  await userEvent.hover(title)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.CONTAINS_FIELDS_WITHOUT_EXTRACTED_DATA))
  })
})
