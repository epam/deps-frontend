
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { NoData } from '@/components/NoData'
import { FieldsSearchInput } from '@/containers/FieldsSearchInput'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { StyledProfileFieldCard } from './ProfileFieldsSearch.styles'
import { ProfileFieldsSearch } from '.'

jest.mock('@/utils/env', () => mockEnv)

const mockFields = [
  {
    field: new DocumentTypeField(
      'MarketingClause',
      'Marketing Clause',
      {},
      FieldType.LIST,
      false,
      0,
      'MarketingContract',
      1,
    ),
    isInProfile: false,
  },
  {
    field: new DocumentTypeField(
      'Test',
      'Test Field',
      {},
      FieldType.LIST,
      false,
      0,
      'TestField',
      2,
    ),
    isInProfile: true,
  },
]

describe('Container: ProfileFieldsSearch', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      fields: mockFields,
      isEditMode: false,
    }

    wrapper = shallow(<ProfileFieldsSearch {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render ProfileFieldCard according to search value if there are fields names which contain this value', () => {
    const search = 'test'

    wrapper.find(FieldsSearchInput).props().onChange(search)

    const searchResult = shallow(<div>{wrapper.props().dropdownRender()}</div>)

    const profileFieldCards = searchResult.find(StyledProfileFieldCard)

    expect(profileFieldCards).toHaveLength(1)
  })

  it('should render NoData if no fields names which contain search value', () => {
    const search = 'random'

    wrapper.find(FieldsSearchInput).props().onChange(search)

    const searchResult = shallow(<div>{wrapper.props().dropdownRender()}</div>)

    const noDataComponent = searchResult.find(NoData)

    expect(noDataComponent.exists()).toEqual(true)
  })

  it('should close search result if search value was cleared', () => {
    const search = 'test'

    wrapper.find(FieldsSearchInput).props().onChange(search)

    expect(wrapper.props().open).toEqual(true)

    const searchNew = ''

    wrapper.find(FieldsSearchInput).props().onChange(searchNew)

    expect(wrapper.props().open).toEqual(false)
  })

  it('should clear search value if search result was closed ', () => {
    const search = 'test'

    wrapper.find(FieldsSearchInput).props().onChange(search)

    wrapper.props().onOpenChange(false)

    const searchInput = wrapper.find(FieldsSearchInput)

    expect(searchInput.props().shouldClear).toEqual(true)
  })
})
