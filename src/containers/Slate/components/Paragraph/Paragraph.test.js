
import { mockComponent } from '@/mocks/mockComponent'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { UiKeys } from '@/constants/navigation'
import { uiSelector } from '@/selectors/navigation'
import { SLATE_ELEMENT_TYPE } from '../../models'
import { Paragraph } from './Paragraph'

jest.mock('@/selectors/navigation')
jest.mock('@/containers/Slate/components/Word', () => mockComponent('Word'))
jest.mock('react-redux', () => mockReactRedux)

const { ConnectedComponent, mapStateToProps } = Paragraph

describe('Component: Paragraph', () => {
  describe('mapStateToProps', () => {
    it('should call uiSelector with state and pass the result as activeSourceId prop', () => {
      const { props } = mapStateToProps()
      expect(uiSelector).toHaveBeenCalled()
      expect(props.activeSourceId).toEqual(uiSelector.getSelectorMockValue()[UiKeys.ACTIVE_SOURCE_ID])
    })
  })
  describe('ConnectedComponent', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        attributes: {
          ref: {
            current: null,
          },
        },
        children: [<div key={0}>Paragraph content</div>],
        element: {
          id: 'id',
          type: SLATE_ELEMENT_TYPE.PARAGRAPH,
        },
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
