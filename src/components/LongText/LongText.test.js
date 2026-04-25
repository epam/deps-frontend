
import { mockReact } from '@/mocks/mockReact'
import { shallow } from 'enzyme'
import React from 'react'
import { LongText } from './LongText'

jest.mock('react', () => mockReact({
  mockUseState: jest.fn((state) => {
    const setState = jest.fn((changes) => {
      state = changes
    })

    return [state, setState]
  }),
  mockUseRef: () => ({
    current: {
      offsetWidth: 2,
      scrollWidth: 1,
    },
  }),
}))

describe('Component: LongText', () => {
  let component, defaultProps

  beforeEach(() => {
    defaultProps = {
      text: 'test',
    }
    component = shallow(<LongText {...defaultProps} />)
  })

  it('should render the correct layout based on the props', () => {
    expect(component).toMatchSnapshot()
  })

  it('should render the correct layout in case OverflowActive is true', () => {
    React.useState = jest.fn(() => ([true, jest.fn()]))

    const wrapper = shallow(<LongText {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
