
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { customizationSelector } from '@/selectors/customization'
import { ApplicationFooter } from './ApplicationFooter'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/customization')
jest.mock('@/selectors/authorization')

describe('Component: ApplicationFooter', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ApplicationFooter />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render ApplicationFooter component in case there is no component in customization', () => {
    customizationSelector.mockImplementationOnce(() => ({}))
    wrapper = shallow(<ApplicationFooter />)
    const Footer = wrapper.find(ModuleLoader)?.children()
    expect(Footer.exists()).toBe(false)
  })
})
