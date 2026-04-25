
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { UiKeys } from '@/constants/navigation'
import { SLATE_ELEMENT_TYPE } from '@/containers/Slate/models'
import { uiSelector } from '@/selectors/navigation'
import { highlightedFieldSelector } from '@/selectors/reviewPage'
import { Cell } from './Cell'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/reviewPage')
jest.mock('@/utils/env', () => mockEnv)

const { ConnectedComponent, mapStateToProps } = Cell

describe('Container: Cell', () => {
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
      const children = <div />
      defaultProps = {
        attributes: {
          ref: {
            current: null,
          },
        },
        element: {
          children: [
            { text: 'text' },
          ],
          type: SLATE_ELEMENT_TYPE.TABLE_CELL,
          attributes: {
            colSpan: 1,
            rowSpan: 1,
          },
          coordinates: {
            row: 0,
            column: 1,
          },
        },
        children: children,
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
