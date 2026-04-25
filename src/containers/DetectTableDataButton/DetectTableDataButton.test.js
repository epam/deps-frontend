
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { detectTableData } from '@/actions/documentReviewPage'
import { DetectTableDataButton } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/documentReviewPage', () => ({
  detectTableData: jest.fn(),
}))
jest.mock('@/selectors/documentReviewPage')
jest.mock('@/utils/env', () => mockEnv)

const { ConnectedComponent, mapDispatchToProps } = DetectTableDataButton

describe('Container: DetectTableDataButton', () => {
  describe('mapDispatchToProps', () => {
    it('should dispatch detectTableData action', () => {
      const { props } = mapDispatchToProps()
      props.detectTableData()
      expect(detectTableData).toHaveBeenCalled()
    })
  })

  describe('connected Component', () => {
    let defaultProps
    let wrapper

    beforeEach(() => {
      defaultProps = {
        children: 'detect',
        disabled: false,
        detectTableData: jest.fn(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
