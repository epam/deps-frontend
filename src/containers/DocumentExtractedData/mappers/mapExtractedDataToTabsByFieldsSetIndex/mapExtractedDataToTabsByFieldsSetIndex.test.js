
import { mockEnv } from '@/mocks/mockEnv'
import { cleanup, screen } from '@testing-library/react'
import { localize, Localization } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { render } from '@/utils/rendererRTL'
import {
  mockDataWithKeyValuePairsFieldSetIndex,
  mockDataWithKeyValuePairsListFieldSetIndex,
  mockDataWithListFieldSetIndex,
  mockDataWithStringFieldSetIndex,
} from '../__mocks__'
import { mapExtractedDataToTabsByFieldsSetIndex } from './mapExtractedDataToTabsByFieldsSetIndex'

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

const WITHOUT_FIELD_SET_KEY = 'without_field_set'
const setIndex1 = 1
const setIndex2 = 2

const mockDocument = new Document({
  id: 'testDocId',
  extractedData: [],
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

test('should create Tab component with correct properties and content layout for every setIndex', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromSet1, fieldFromSet2] } = mockDataWithStringFieldSetIndex
  const fieldsSetIndexes = [setIndex1, setIndex2]

  const tabs = mapExtractedDataToTabsByFieldsSetIndex({
    document: {
      ...mockDocument,
      extractedData: [fieldFromSet1, fieldFromSet2],
    },
    documentType: mockDocumentType,
  })

  expect(tabs).toHaveLength(fieldsSetIndexes.length)

  fieldsSetIndexes.forEach((setIndex, i) => {
    expect(tabs[i].key).toEqual(`${setIndex}`)
    expect(tabs[i].label).toEqual(localize(Localization.FIELD_SET_TAB_NAME, { setIndex }))

    const { children: tabContent } = tabs[i]

    render(
      tabContent,
    )

    expect(screen.getByTestId('document-fields')).toBeInTheDocument()

    cleanup()
  })
})

test('should create Tab component with correct properties and content for extracted data fields without setIndex', () => {
  const pk2 = 'stringPk2'
  const { mockDocumentType, mockExtractedData: [fieldFromSet1] } = mockDataWithStringFieldSetIndex

  const withoutSetIndexField = new ExtractedDataField(
    pk2,
    new FieldData(
      'string',
    ),
  )

  const [, withoutFieldSetTab] = mapExtractedDataToTabsByFieldsSetIndex({
    document: {
      ...mockDocument,
      extractedData: [fieldFromSet1, withoutSetIndexField],
    },
    documentType: mockDocumentType,
  })

  expect(withoutFieldSetTab.key).toEqual(WITHOUT_FIELD_SET_KEY)
  expect(withoutFieldSetTab.label).toEqual(localize(Localization.WITHOUT_FIELD_SET))

  const { children: withoutFieldSetTabContent } = withoutFieldSetTab

  render(
    withoutFieldSetTabContent,
  )

  expect(screen.getByText(withoutSetIndexField.fieldPk)).toBeInTheDocument()
  expect(screen.queryByText(fieldFromSet1.fieldPk)).not.toBeInTheDocument()
})

test('should group extracted data fields by setIndex correctly for primitive field type', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromSet1, fieldFromSet2] } = mockDataWithStringFieldSetIndex

  const tabs = mapExtractedDataToTabsByFieldsSetIndex({
    document: {
      ...mockDocument,
      extractedData: [fieldFromSet1, fieldFromSet2],
    },
    documentType: mockDocumentType,
  })

  checkTabsContent(tabs, fieldFromSet1, fieldFromSet2)
})

test('should group extracted data fields by setIndex correctly for list field type', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromSet1, fieldFromSet2] } = mockDataWithListFieldSetIndex

  const tabs = mapExtractedDataToTabsByFieldsSetIndex({
    document: {
      ...mockDocument,
      extractedData: [fieldFromSet1, fieldFromSet2],
    },
    documentType: mockDocumentType,
  })

  checkTabsContent(tabs, fieldFromSet1, fieldFromSet2)
})

test('should group extracted data fields by setIndex correctly for key value pair field type', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromSet1, fieldFromSet2] } = mockDataWithKeyValuePairsFieldSetIndex

  const tabs = mapExtractedDataToTabsByFieldsSetIndex({
    document: {
      ...mockDocument,
      extractedData: [fieldFromSet1, fieldFromSet2],
    },
    documentType: mockDocumentType,
  })

  checkTabsContent(tabs, fieldFromSet1, fieldFromSet2)
})

test('should group extracted data fields by setIndex correctly for list of key value pairs field type', () => {
  const { mockDocumentType, mockExtractedData: [fieldFromSet1, fieldFromSet2] } = mockDataWithKeyValuePairsListFieldSetIndex

  const tabs = mapExtractedDataToTabsByFieldsSetIndex({
    document: {
      ...mockDocument,
      extractedData: [fieldFromSet1, fieldFromSet2],
    },
    documentType: mockDocumentType,
  })

  checkTabsContent(tabs, fieldFromSet1, fieldFromSet2)
})
