
import { mockReact } from '@/mocks/mockReact'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { useInView } from 'react-intersection-observer'
import { setScrollId } from '@/actions/navigation'
import { UiKeys } from '@/constants/navigation'
import { uiSelector } from '@/selectors/navigation'
import { InView } from './InView'

const mockElement = document.createElement('div')
mockElement.scrollIntoView = jest.fn()

jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('@/selectors/navigation')
jest.mock('@/actions/navigation', () => ({
  setScrollId: jest.fn(),
}))
jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(),
}))
jest.spyOn(window.document, 'getElementById').mockReturnValue(mockElement)

const {
  mapStateToProps,
  mapDispatchToProps,
  ConnectedComponent,
} = InView

describe('Container: InView', () => {
  describe('mapStateToProps', () => {
    it('should call uiSelector and pass the result as scrollId prop', () => {
      const { props } = mapStateToProps()

      expect(uiSelector).toHaveBeenCalled()
      expect(props.scrollId).toEqual(uiSelector.getSelectorMockValue()[UiKeys.SCROLL_ID])
    })
  })

  describe('mapDispatchToProps', () => {
    it('should call to setScrollId action when calling to setScrollId prop', () => {
      const { props } = mapDispatchToProps()

      props.setScrollId()
      expect(setScrollId).nthCalledWith(1)
    })
  })

  describe('ConnectedComponent', () => {
    let wrapper, defaultProps

    beforeEach(() => {
      defaultProps = {
        children: <div />,
        id: uiSelector.getSelectorMockValue()[UiKeys.SCROLL_ID],
        triggerOnce: false,
        setScrollId: jest.fn(),
        ...mapStateToProps().props,
      }
    })

    it('should render correct layout in case the observed component is in view', () => {
      useInView.mockImplementationOnce(() => ({ inView: true }))
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('should render correct layout in case the observed component is not in view', () => {
      useInView.mockImplementationOnce(() => ({ inView: false }))
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('should call scrollIntoView and setScrollId with correct params in case the observed component is in view and scrollId is equal to id prop', () => {
      useInView.mockImplementationOnce(() => ({ inView: true }))
      const expectedParam = ''

      shallow(<ConnectedComponent {...defaultProps} />)
      expect(mockElement.scrollIntoView).nthCalledWith(1, { behavior: 'smooth' })
      expect(defaultProps.setScrollId).nthCalledWith(1, expectedParam)
    })

    it('should call scrollIntoView in case the observed component is not in view and scrollId is equal to id prop', () => {
      useInView.mockImplementationOnce(() => ({ inView: false }))

      shallow(<ConnectedComponent {...defaultProps} />)
      expect(mockElement.scrollIntoView).nthCalledWith(1, { behavior: 'smooth' })
    })

    it('should call useInView with correct params', () => {
      useInView.mockImplementationOnce(() => ({ inView: false }))
      const expectedResult = { triggerOnce: defaultProps.triggerOnce }

      shallow(<ConnectedComponent {...defaultProps} />)
      expect(useInView).nthCalledWith(1, expectedResult)
    })
  })
})
