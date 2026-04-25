
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ApplicationLayout } from './ApplicationLayout'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useRouteMatch: jest.fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false),
}))

jest.mock('@/containers/ApplicationHeader', () => mockComponent('ApplicationHeader'))

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ApplicationLayout for specified route', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      children: <div />,
    }
  })

  it('should render correct layout without header and sidebar', () => {
    wrapper = shallow(<ApplicationLayout {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout with header and sidebar', () => {
    wrapper = shallow(<ApplicationLayout {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })
})
