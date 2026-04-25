
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { userSelector } from '@/selectors/authorization'
import { ChangeOrganisationForm } from './ChangeOrganisationForm'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((f) => f),
  useMemo: jest.fn((f) => f()),
}))
jest.mock('@/selectors/authorization')
jest.mock('@/components/Form/ReactHookForm/FormItem', () => mockComponent('FormItem'))

const { ConnectedComponent, mapStateToProps } = ChangeOrganisationForm

describe('Container: ChangeOrganisationForm', () => {
  describe('mapStateToProps', () => {
    it('should call to userSelector with state and pass the result as user prop', () => {
      const { props } = mapStateToProps()
      expect(userSelector).toHaveBeenCalled()
      expect(props.user).toEqual(userSelector.getSelectorMockValue())
    })
  })

  describe('Connected Component', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        user: userSelector.getSelectorMockValue(),
      }

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
