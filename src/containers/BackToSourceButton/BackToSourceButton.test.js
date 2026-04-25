
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { goTo } from '@/actions/navigation'
import { Button } from '@/components/Button'
import { navigationMap } from '@/utils/navigationMap'
import { BackToSourceButton } from '.'

const mockEvent = {
  stopPropagation: jest.fn(),
}

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))

describe('Container: BackToSourceButton', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      sourcePath: navigationMap.templates(),
    }

    wrapper = shallow(<BackToSourceButton {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call goTo action when click on redirection icon button', () => {
    delete window.location
    window.location = new URL('http://localhost:8080/templates')

    wrapper.find(Button.Secondary).props().onClick(mockEvent)

    expect(goTo).nthCalledWith(
      1,
      navigationMap.templates(),
    )
  })
})
