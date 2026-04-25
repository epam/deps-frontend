
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { fetchTrialLimitationsInfo } from '@/actions/trial'
import { Spin } from '@/components/Spin'
import { isTrialLimitationsInfoFetchingSelector } from '@/selectors/requests'
import { TrialDrawer } from '.'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('react', () => mockReact())
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/trial', () => ({
  fetchTrialLimitationsInfo: jest.fn(),
}))

jest.mock('@/selectors/trial')
jest.mock('@/selectors/requests')

describe('Container: TrialDrawer', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      closeDrawer: jest.fn(),
      visible: true,
    }

    wrapper = shallow(<TrialDrawer {...defaultProps} />)
  })

  it('should render TrialDrawerButton with correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should show spinning Spin if limitations are fetching', () => {
    isTrialLimitationsInfoFetchingSelector.mockImplementationOnce(() => true)

    wrapper = shallow(<TrialDrawer {...defaultProps} />)

    expect(wrapper.find(Spin).props().spinning).toBe(true)
  })

  it('should not call fetchTrialLimitationsInfo if drawer is hidden', () => {
    jest.clearAllMocks()

    defaultProps.visible = false

    wrapper = shallow(<TrialDrawer {...defaultProps} />)

    expect(fetchTrialLimitationsInfo).not.toHaveBeenCalled()
  })
})
