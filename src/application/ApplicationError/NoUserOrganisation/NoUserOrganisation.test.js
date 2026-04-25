
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { authenticationProvider } from '@/authentication'
import { Button } from '@/components/Button'
import { NoUserOrganisation } from '.'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/authentication', () => ({
  authenticationProvider: {
    signOut: jest.fn(),
  },
}))

describe('Page: NoUserOrganisation', () => {
  let component

  beforeEach(() => {
    component = shallow(<NoUserOrganisation />)
  })

  it('should render the correct layout', () => {
    expect(component).toMatchSnapshot()
  })

  it('should user sign out in case of button click', () => {
    const buttonProps = component.find(Button).props()
    buttonProps.onClick()
    expect(authenticationProvider.signOut).toBeCalled()
  })
})
