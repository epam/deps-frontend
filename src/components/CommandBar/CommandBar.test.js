
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import React from 'react'
import { CustomMenu } from '@/components/Menu/CustomMenu'
import { Command } from './CommandBar.styles'
import { CommandBar } from '.'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react', () => mockReact())

describe('Component: CommandBar', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      commands: [{
        renderComponent: () => <div />,
        onClick: jest.fn(),
        hidden: false,
        visible: jest.fn(() => true),
      }],
      customSize: {
        width: '10',
        height: '20',
      },
    }

    wrapper = shallow(<CommandBar {...defaultProps} />)
  })

  it('should render correct layout according to props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onClick callback of command when click', () => {
    wrapper.find(Command).props().onClick()
    expect(defaultProps.commands[0].onClick).toHaveBeenCalled()
  })

  it('should not render hidden commands', () => {
    const HiddenComponent = <div />
    const hiddenCommand = {
      renderComponent: () => HiddenComponent,
      hidden: true,
      visible: jest.fn(),
      onClick: jest.fn(),
    }

    defaultProps.commands = [
      hiddenCommand,
    ]

    wrapper.setProps(defaultProps)

    const CustomMenuComponent = wrapper.find(CustomMenu)
    expect(CustomMenuComponent.props().items).toHaveLength(0)
  })

  it('should render hidden commands if dropdown is expanded', () => {
    const HiddenComponent = <div />
    const hiddenCommand = {
      renderComponent: () => HiddenComponent,
      hidden: true,
      visible: jest.fn(),
      onClick: jest.fn(),
    }

    defaultProps.commands = [
      hiddenCommand,
    ]

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()])

    wrapper.setProps(defaultProps)

    const CustomMenuComponent = wrapper.find(CustomMenu)
    expect(CustomMenuComponent.props().items).toHaveLength(defaultProps.commands.length)
  })
})
