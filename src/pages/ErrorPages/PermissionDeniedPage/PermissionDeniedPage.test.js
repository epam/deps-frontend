
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { goTo } from '@/actions/navigation'
import { Button } from '@/components/Button'
import { history } from '@/utils/history'
import { navigationMap } from '@/utils/navigationMap'
import { RetryButton } from './PermissionDeniedPage.styles'
import { PermissionDeniedPage } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Component: PermissionDeniedPage', () => {
  let component

  beforeEach(() => {
    component = shallow(<PermissionDeniedPage />)
  })

  it('should render the correct layout', () => {
    expect(component).toMatchSnapshot()
  })

  it('should redirect to home page in case of home page button click', () => {
    const buttonProps = component.find(Button).props()
    buttonProps.onClick()

    expect(goTo).nthCalledWith(1, navigationMap.home())
  })

  it('should return to previous page in case of retry button click', () => {
    history.goBack = jest.fn()

    const buttonProps = component.find(RetryButton).props()
    buttonProps.onClick()

    expect(history.goBack).toBeCalled()
  })
})
