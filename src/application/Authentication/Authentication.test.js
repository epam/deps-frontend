
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Authentication } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/application/Root', () => mockComponent('Root'))

describe('Component: Authentication', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Authentication />)
  })

  it('should render component correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
