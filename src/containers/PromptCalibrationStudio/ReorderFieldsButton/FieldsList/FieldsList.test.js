
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Field, MULTIPLICITY } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { render } from '@/utils/rendererRTL'
import { FieldsList } from './FieldsList'

jest.mock('@/utils/env', () => mockEnv)

const mockField = new Field({
  id: 'field-1',
  name: 'Test Field',
  fieldType: FieldType.STRING,
  extractorId: 'extractor-1',
  multiplicity: MULTIPLICITY.SINGLE,
  value: 'Test Value',
})

const fields = [mockField]

test('shows list of fields', async () => {
  render(
    <FieldsList
      fields={fields}
      setFields={jest.fn()}
    />,
  )

  fields.forEach((field) => {
    expect(screen.getByText(field.name)).toBeInTheDocument()
  })
})
