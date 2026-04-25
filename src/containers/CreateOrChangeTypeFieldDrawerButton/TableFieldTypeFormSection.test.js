
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import ShallowRenderer from 'react-test-renderer/shallow'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import {
  TableFieldMeta,
  TableFieldColumn,
} from '@/models/DocumentTypeFieldMeta'
import { render } from '@/utils/rendererRTL'
import { TableFieldTypeFormSection } from './TableFieldTypeFormSection'

jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/utils/env', () => mockEnv)

const defaultValues = {
  field: new DocumentTypeField(
    'tableCode',
    'tableName',
    new TableFieldMeta([
      new TableFieldColumn('column title'),
    ]),
    FieldType.TABLE,
    true,
    3,
    'mockDocumentTypeCode',
    0,
  ),
}

describe('Container: TableFieldTypeFormSection', () => {
  it('should render component correctly', () => {
    const renderer = new ShallowRenderer()
    const wrapper = renderer.render(<TableFieldTypeFormSection />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render CustomSelect component', () => {
    render(<TableFieldTypeFormSection {...defaultValues} />)
    const input = screen.getByRole('combobox')
    expect(input).toMatchSnapshot()
  })
})
