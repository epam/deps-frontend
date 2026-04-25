
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { render } from '@/utils/rendererRTL'
import { FieldsList } from './FieldsList'

jest.mock('@/utils/env', () => mockEnv)

const mockExtractionField = new DocumentTypeField(
  'mockCode1',
  'mockName1',
  new DocumentTypeFieldMeta(),
  FieldType.STRING,
  false,
  1,
  'code',
  2,
)

const mockExtraField = new DocumentTypeExtraField({
  code: 'mockCode2',
  name: 'mockName2',
  order: 2,
})

const fields = [
  mockExtractionField,
  mockExtraField,
]

test('shows list of fields', async () => {
  const mockGetFieldCategory = jest.fn(() => DocumentTypeFieldCategory.EXTRACTION)

  render(
    <FieldsList
      fields={fields}
      getFieldCategory={mockGetFieldCategory}
      setFields={jest.fn()}
    />,
  )

  fields.forEach((field) => {
    expect(screen.getByText(field.name)).toBeInTheDocument()
    expect(mockGetFieldCategory).toHaveBeenCalledWith(
      expect.objectContaining(field),
    )
  })
})
