
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DictFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { DictionaryFieldTypeFormSection } from './DictionaryFieldTypeFormSection'

jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/utils/env', () => mockEnv)

describe('Container: DictionaryFieldTypeFormSection', () => {
  let defaultValues, wrapper

  beforeEach(() => {
    defaultValues = {
      field: new DocumentTypeField(
        'kvCode',
        'kvName',
        new DictFieldMeta(),
        FieldType.DICTIONARY,
        false,
        0,
        'whole',
        7,
      ),
    }

    wrapper = shallow(<DictionaryFieldTypeFormSection {...defaultValues} />)
  })

  it('should render component correctly based on props', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
