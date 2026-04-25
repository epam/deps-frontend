
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import React from 'react'
import { setCustomization } from '@/actions/customization'
import { useCustomization } from '@/hooks/useCustomization'
import { OrganisationSettings } from './OrganisationSettings'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/authorization')
jest.mock('@/hooks/useCustomization', () => ({
  useCustomization: jest.fn(() => ({
    ready: true,
    failed: false,
    module: () => 'mock',
  })),
}))
jest.mock('@/actions/customization', () => ({
  setCustomization: jest.fn(),
}))
jest.mock('@/selectors/requests')

describe('Component: OrganisationSettings', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      children: <div>Application</div>,
    }

    wrapper = shallow(<OrganisationSettings {...defaultProps} />)
  })

  it('should render layout correctly according to props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call setCustomization when initial customization module was loaded', () => {
    expect(setCustomization).nthCalledWith(1, 'mock')
  })

  it('should not call setCustomization when initial customization module was not loaded', () => {
    jest.clearAllMocks()
    useCustomization.mockImplementationOnce(jest.fn(() => ({
      ready: false,
    })))
    expect(setCustomization).not.toHaveBeenCalled()
  })

  it('should render layout correctly in case of error during customization loading', () => {
    jest.clearAllMocks()
    useCustomization.mockImplementationOnce(jest.fn(() => ({
      ready: false,
      failed: true,
    })))
    wrapper = shallow(<OrganisationSettings {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render layout correctly in case initCustomization module was not loaded yet', () => {
    jest.clearAllMocks()
    useCustomization.mockImplementationOnce(jest.fn(() => ({
      ready: false,
    })))
    wrapper = shallow(<OrganisationSettings {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
