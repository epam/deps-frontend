
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { UiKeys } from '@/constants/navigation'
import { uiSelector } from '@/selectors/navigation'
import { highlightedFieldSelector } from '@/selectors/reviewPage'
import { Word } from './Word'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/reviewPage')
jest.mock('@/utils/env', () => mockEnv)

const { ConnectedComponent, mapStateToProps } = Word

describe('Component: Word', () => {
  describe('mapStateToProps:', () => {
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
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        attributes: {},
        children: (
          <div parent={{ id: 'mockId' }}>
            Word content
          </div>
        ),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
