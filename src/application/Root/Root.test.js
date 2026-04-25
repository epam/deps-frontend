
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRouter } from '@/mocks/mockReactRouter'
import { shallow } from 'enzyme'
import { Root } from '@/application/Root'

jest.mock('react-router', () => mockReactRouter)
jest.mock('@/application/ApplicationLayout', () => mockComponent('ApplicationLayout'))
jest.mock('@/components/ErrorBoundRoute', () => mockComponent('ErrorBoundRoute'))
jest.mock('@/utils/env', () => mockEnv)

describe('Component: Root', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Root />)
  })

  it('should render component correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
