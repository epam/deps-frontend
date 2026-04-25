
import { shallow } from 'enzyme'
import { CustomSelect } from '@/components/Select'
import { PaginationButton, SelectStyled } from './PageSwitcher.styles'
import { PageSwitcher } from '.'

describe('Component: PageSwitcher', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      className: 'test',
      pagesQuantity: 3,
      activePage: 1,
      changeActivePage: jest.fn(),
      disabled: false,
      pageOptions: [
        <CustomSelect.Option key={1}>1</CustomSelect.Option>,
        <CustomSelect.Option key={1}>2</CustomSelect.Option>,
      ],
    }
    wrapper = shallow(<PageSwitcher {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call to changeActivePage prop with previous page', () => {
    const PaginationButtonWrapper = wrapper.find(PaginationButton).at(0)
    PaginationButtonWrapper.props().onClick()
    expect(defaultProps.changeActivePage).nthCalledWith(1, defaultProps.activePage - 1)
  })

  it('should call to changeActivePage prop with next page', () => {
    const PaginationButtonWrapper = wrapper.find(PaginationButton).at(1)
    PaginationButtonWrapper.props().onClick()
    expect(defaultProps.changeActivePage).nthCalledWith(1, defaultProps.activePage + 1)
  })

  it('should call to changeActivePage prop with next page (changed with onSelectChange)', () => {
    const SelectWrapper = wrapper.find(SelectStyled)
    SelectWrapper.props().onChange(2)

    expect(defaultProps.changeActivePage).nthCalledWith(1, 2)
  })
})
