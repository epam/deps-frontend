
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Button } from '@/components/Button'
import { navigationMap } from '@/utils/navigationMap'
import { ErrorFallback } from '.'

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Component: ErrorFallback', () => {
  let component

  beforeEach(() => {
    component = shallow(<ErrorFallback />)
  })

  it('should render the correct layout', () => {
    expect(component).toMatchSnapshot()
  })

  it('should redirect to home page in case of button click', () => {
    delete window.location
    window.location = new URL('https://mock.com')
    window.location.replace = jest.fn()
    const buttonProps = component.find(Button).props()
    buttonProps.onClick()
    expect(window.location.replace).nthCalledWith(1, navigationMap.home())
  })
})
