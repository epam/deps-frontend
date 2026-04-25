
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DictFieldMeta, ListFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ListFieldTypeFormSection } from './ListFieldTypeFormSection'

jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/utils/env', () => mockEnv)

describe('Container: ListFieldTypeFormSection', () => {
  let defaultValues, wrapper

  beforeEach(() => {
    defaultValues = {
      field: new DocumentTypeField(
        'listCode',
        'listName',
        new ListFieldMeta(FieldType.DICTIONARY, new DictFieldMeta()),
        FieldType.LIST,
        false,
        0,
        'whole',
        4,
      ),
      baseType: FieldType.DICTIONARY,
    }

    wrapper = shallow(<ListFieldTypeFormSection {...defaultValues} />)
  })

  it('should render component correctly based on props', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
