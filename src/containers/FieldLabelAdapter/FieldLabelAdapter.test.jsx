
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { TableFieldMeta, TableFieldColumn } from '@/models/DocumentTypeFieldMeta'
import { customizationSelector } from '@/selectors/customization'
import { FieldLabelAdapter } from './FieldLabelAdapter'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/customization')
jest.mock('@/selectors/authorization')

describe('Container: FieldLabelAdapter', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      dtField: new DocumentTypeField(
        'tableCode',
        'Field table name',
        new TableFieldMeta([
          new TableFieldColumn('column title'),
        ]),
        FieldType.TABLE,
        true,
        3,
        'mockDocumentTypeCode',
        0,
      ),
      active: true,
    }
    wrapper = shallow(<FieldLabelAdapter {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout if customization isn\'t provided', () => {
    customizationSelector.mockImplementationOnce(() => ({}))

    wrapper = shallow(<FieldLabelAdapter {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })
})
