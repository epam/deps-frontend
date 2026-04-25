import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { changeActiveTab, setActiveField } from '@/actions/documentReviewPage'
import { setScrollId } from '@/actions/navigation'
import {
  documentSelector,
  documentTypeSelector,
  fieldsGroupingSelector,
} from '@/selectors/documentReviewPage'
import { ValidationResults } from './ValidationResults'
import { MenuItem } from './ValidationResults.styles'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/actions/navigation', () => ({
  setScrollId: jest.fn(),
}))
jest.mock('@/actions/documentReviewPage', () => ({
  changeActiveTab: jest.fn(),
  setActiveField: jest.fn(),
}))
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/selectors/documentReviewPage')

const { ConnectedComponent, mapStateToProps, mapDispatchToProps } = ValidationResults

describe('Component: ValidationResults', () => {
  describe('mapDispatchToProps', () => {
    it('should call to setScrollId action when calling to setScrollId prop', () => {
      const { props } = mapDispatchToProps()

      props.setScrollId()
      expect(setScrollId).toHaveBeenCalledTimes(1)
    })

    it('should call to changeActiveTab action when calling changeActiveTab prop', () => {
      const { props } = mapDispatchToProps()

      props.changeActiveTab()
      expect(changeActiveTab).toHaveBeenCalled()
    })

    it('should call to setActiveField action when calling setActiveField prop', () => {
      const { props } = mapDispatchToProps()

      props.setActiveField()
      expect(setActiveField).toHaveBeenCalled()
    })
  })

  describe('mapStateToProps', () => {
    it('should call documentSelector and pass the result as document prop', () => {
      const { props } = mapStateToProps()

      expect(documentSelector).toHaveBeenCalled()
      expect(props.document).toEqual(documentSelector.getSelectorMockValue())
    })

    it('should call documentTypeSelector and pass the result as documentType prop', () => {
      const { props } = mapStateToProps()

      expect(documentTypeSelector).toHaveBeenCalled()
      expect(props.documentType).toEqual(documentTypeSelector.getSelectorMockValue())
    })

    it('should call fieldsGroupingSelector and pass the result as fieldsGrouping prop', () => {
      const { props } = mapStateToProps()

      expect(fieldsGroupingSelector).toHaveBeenCalled()
      expect(props.fieldsGrouping).toEqual(fieldsGroupingSelector.getSelectorMockValue())
    })
  })

  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      changeActiveTab: jest.fn(),
      document: documentSelector.getSelectorMockValue(),
      documentType: documentTypeSelector.getSelectorMockValue(),
      fieldsGrouping: fieldsGroupingSelector.getSelectorMockValue(),
      setScrollId: jest.fn(),
      setActiveField: jest.fn(),
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render dropdown menu correctly', () => {
    expect(shallow(<div>{wrapper.props().dropdownRender()}</div>)).toMatchSnapshot()
  })

  it('should return null if there is no warning and error messages', () => {
    const props = {
      ...defaultProps,
      document: {
        ...document,
        validation: {
          isValid: true,
          details: [],
        },
      },
    }

    wrapper.setProps(props)

    expect(wrapper.isEmptyRender()).toBe(true)
  })

  it('should call setScrollId and setActiveFieldPk if click on MenuItem', () => {
    const menuContent = wrapper.props().dropdownRender()
    const MenuWrapper = shallow(<div>{menuContent}</div>)
    MenuWrapper.find(MenuItem).at(1).props().onClick()

    expect(defaultProps.setScrollId).toHaveBeenCalled()
    expect(defaultProps.setActiveField).toHaveBeenCalledTimes(1)
  })
})
