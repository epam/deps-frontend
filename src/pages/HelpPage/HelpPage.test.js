
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import React from 'react'
import { HelpPage } from './HelpPage'
import { Tabs } from './HelpPage.styles'

const mockSetState = jest.fn()

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((f) => [f, mockSetState]),
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Component: HelpPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<HelpPage />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call mockSetState when active tab changed', () => {
    wrapper.find(Tabs).props().onChange()
    expect(mockSetState).toHaveBeenCalledTimes(1)
  })

  it('should correctly render tabs content', () => {
    wrapper.find(Tabs).props().tabs.forEach((tab) => {
      const content = shallow(<div>{tab.children}</div>)
      expect(content).toMatchSnapshot()
    })
  })
})
