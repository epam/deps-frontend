
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { useState } from 'react'
import { ServiceVersionCard } from './ServiceVersionCard'

const mockCorrectData = {
  buildTag: 'ocr',
  buildDate: '20.08.1992',
  commitHash: 'someHash',
}

const mockError = {
  config: 'mockError',
}

jest.mock('react', () => mockReact())
jest.mock('@/utils/env', () => mockEnv)

describe('Component: ServicesVersionsCard', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      servicesVersionsApiRequest: jest.fn(),
      serviceName: 'OCR',
    }
  })

  it('should render correct layout in case service version was fetched', () => {
    useState.mockReturnValueOnce([mockCorrectData, jest.fn()])
    useState.mockReturnValueOnce([null, jest.fn()])
    useState.mockReturnValueOnce([false, jest.fn()])
    wrapper = shallow(<ServiceVersionCard {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout in case the fetching service version failed', () => {
    useState.mockReturnValueOnce([null, jest.fn()])
    useState.mockReturnValueOnce([mockError, jest.fn()])
    useState.mockReturnValueOnce([false, jest.fn()])
    wrapper = shallow(<ServiceVersionCard {...defaultProps} />)
    expect(wrapper).toMatchSnapshot()
  })
})
