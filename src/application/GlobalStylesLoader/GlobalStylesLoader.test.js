
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { customizationSelector } from '@/selectors/customization'
import { GlobalStylesLoader } from './GlobalStylesLoader'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/customization')
jest.mock('@/selectors/authorization')

const Test = () => <div>Test</div>

describe('Component: GlobalStylesLoader', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <GlobalStylesLoader>
        <Test />
      </GlobalStylesLoader>,
    )
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly in case there is no customization', () => {
    customizationSelector.mockImplementationOnce(() => ({}))
    wrapper = shallow(
      <GlobalStylesLoader>
        <Test />
      </GlobalStylesLoader>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
