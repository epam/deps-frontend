
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { Canvas } from '@/components/ImageViewer/Canvas'
import { UiKeys } from '@/constants/navigation'
import { SLATE_ELEMENT_TYPE } from '@/containers/Slate/models'
import { Point } from '@/models/Point'
import { uiSelector } from '@/selectors/navigation'
import { highlightedFieldSelector } from '@/selectors/reviewPage'
import { Image } from './Image'

jest.mock('@/selectors/navigation')
jest.mock('@/selectors/reviewPage')
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)

const { mapStateToProps, ConnectedComponent } = Image

const mockRefElement = document.createElement('div')
mockRefElement.scrollIntoView = jest.fn()

const mockHighlightedBbox = [[
  new Point(0.1, 0.2),
  new Point(0.3, 0.4),
]]

describe('Component: Image', () => {
  describe('mapStateToProps', () => {
    it('should call uiSelector with state and pass the result as activeSourceId prop', () => {
      const { props } = mapStateToProps()
      expect(uiSelector).toHaveBeenCalled()
      expect(props.activeSourceId).toEqual(uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_SOURCE_ID])
    })

    it('should call highlightedFieldSelector with state and pass the result as highlightedField prop', () => {
      const { props } = mapStateToProps()
      expect(highlightedFieldSelector).toHaveBeenCalled()
      expect(props.highlightedField).toEqual(highlightedFieldSelector.getSelectorMockValue())
    })
  })

  describe('ConnectedComponent', () => {
    let wrapper, defaultProps

    beforeEach(() => {
      defaultProps = {
        attributes: {
          ref: {
            current: mockRefElement,
          },
        },
        element: {
          attributes: {
            width: 1,
            height: 2,
          },
          type: SLATE_ELEMENT_TYPE.IMAGE,
          id: 'mockId',
          children: [
            { text: 'mockText' },
          ],
          url: 'mockImageUrl',
        },
        activeSourceId: uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_SOURCE_ID],
        highlightedField: null,
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should not call scrollIntoView in initial render', () => {
      expect(defaultProps.attributes.ref.current.scrollIntoView).not.toBeCalled()
    })

    it('should call scrollIntoView in case of image have to be highlighted', () => {
      uiSelector.mockImplementation(() => ({
        [UiKeys.ACTIVE_SOURCE_ID]: defaultProps.element.id,
      }))

      defaultProps = {
        ...defaultProps,
        activeSourceId: uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_SOURCE_ID],
        highlightedField: mockHighlightedBbox,
      }

      wrapper.setProps(defaultProps)
      expect(defaultProps.attributes.ref.current.scrollIntoView).toBeCalled()
    })

    it('should pass highlightedField as a rectCoords prop to Canvas', () => {
      uiSelector.mockImplementation(() => ({
        [UiKeys.ACTIVE_SOURCE_ID]: defaultProps.element.id,
      }))

      defaultProps = {
        ...defaultProps,
        activeSourceId: uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_SOURCE_ID],
        highlightedField: mockHighlightedBbox,
      }

      wrapper.setProps(defaultProps)
      const canvas = wrapper.find(Canvas)
      expect(canvas.props().polygons).toEqual(defaultProps.highlightedField)
    })
  })
})
