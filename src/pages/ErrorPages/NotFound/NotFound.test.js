
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { goTo } from '@/actions/navigation'
import { Button } from '@/components/Button'
import { navigationMap } from '@/utils/navigationMap'
import { NotFound } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Component: NotFound', () => {
  let component

  beforeEach(() => {
    component = shallow(<NotFound />)
  })

  it('should render the correct layout', () => {
    expect(component).toMatchSnapshot()
  })

  it('should redirect to home page in case of button click', () => {
    const buttonProps = component.find(Button).props()
    buttonProps.onClick()
    expect(goTo).nthCalledWith(1, navigationMap.home())
  })
})
