import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { goTo } from '@/actions/navigation'
import { HelpGroupNavigationItems } from './HelpGroupNavigationItems'
import { RemoteMFENavigationItems } from './RemoteMFENavigationItems'
import { ApplicationNavigation } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn(),
}))
jest.mock('react', () => mockReact({
  mockUseState: jest.fn((state) => {
    const setState = jest.fn((changes) => {
      state = changes
    })

    return [state, setState]
  }),
}))
jest.mock('@/utils/env', () => mockEnv)

const mockSidebarConfig = [
  [{
    path: 'mock-path-1',
    title: 'mock-title-1',
    icon: 'mock-icon-1',
  }],
]

const { mapDispatchToProps, ConnectedComponent } = ApplicationNavigation

describe('Container: ApplicationNavigation', () => {
  describe('mapDispatchToProps', () => {
    it('should dispatch goTo action', () => {
      const { props } = mapDispatchToProps()

      props.goTo()

      expect(goTo).toHaveBeenCalled()
    })
  })

  describe('as a component', () => {
    let wrapper
    let defaultProps

    beforeEach(() => {
      defaultProps = {
        goTo: jest.fn(),
        location: {
          pathname: 'mockPath',
        },
      }
      React.useState = jest.fn()
        .mockReturnValueOnce([mockSidebarConfig, jest.fn()])

      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
    })

    it('should render correct layout', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render nothing when sidebarConfig is empty', () => {
      React.useState = jest.fn()
        .mockReturnValueOnce([[], jest.fn()])
      wrapper = shallow(<ConnectedComponent {...defaultProps} />)
      expect(wrapper.find(ConnectedComponent).exists()).toBe(false)
    })

    it('should pass correct extra navigation items', () => {
      const Extra = shallow(
        <div>
          {wrapper.props().renderExtraItems()}
        </div>,
      )

      expect(Extra.find(RemoteMFENavigationItems)).toBeDefined()
      expect(Extra.find(HelpGroupNavigationItems)).toBeDefined()
    })
  })
})
