
import { shallow } from 'enzyme'
import { LogoIcon } from '@/components/Icons/LogoIcon'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { openInNewTarget } from '@/utils/window'
import { ApplicationLogo } from './ApplicationLogo'

let mockCallbackFn

jest.mock('@/utils/window', () => ({
  openInNewTarget: jest.fn((event, url, cb) => {
    mockCallbackFn = cb
    cb()
  }),
}))

jest.mock('@/utils/routerActions', () => ({
  goTo: jest.fn(),
}))

const mockPath = '/documents'

describe('Container: ApplicationLogo', () => {
  let wrapper, event

  beforeEach(() => {
    event = {
      ctrlKey: false,
      shiftKey: false,
      target: {
        value: 'mockValue',
      },
    }

    wrapper = shallow(<ApplicationLogo />)
  })

  it('should render ApplicationLogo with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call openInNewTarget function with correct arguments after click LogoIcon component', () => {
    const logoIcon = wrapper.find(LogoIcon)
    logoIcon.props().onClick(event)
    expect(openInNewTarget).nthCalledWith(1, event, mockPath, mockCallbackFn)
  })

  it('should call goTo function with correct arguments after click LogoIcon component', () => {
    const logoIcon = wrapper.find(LogoIcon)
    logoIcon.props().onClick(event)
    expect(goTo).nthCalledWith(1, navigationMap.home())
  })
})
