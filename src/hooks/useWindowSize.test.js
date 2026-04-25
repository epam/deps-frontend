
import { mockReact } from '@/mocks/mockReact'
import { shallow } from 'enzyme'
import lodashDebounce from 'lodash/debounce'
import React from 'react'
import { useWindowSize } from './useWindowSize'

let mockOnUnmount, mockHandleResize

jest.mock('react', () => mockReact({
  mockUseEffect: jest.fn((f) => {
    mockOnUnmount = f()
  }),
}))

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => {
    mockHandleResize = fn
    return fn
  }),
)

const MockComponent = () => {
  useWindowSize()
  return null
}

describe('Hook: useWindowSize', () => {
  window.addEventListener = jest.fn()
  window.removeEventListener = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    shallow(<MockComponent />)
  })

  it('should call addEventListener with correct args in case component mounting', () => {
    expect(window.addEventListener).nthCalledWith(1, 'resize', mockHandleResize)
  })

  it('should call removeEventListener with correct args in case component unmounting', () => {
    const cleanup = mockOnUnmount
    cleanup()
    expect(window.removeEventListener).nthCalledWith(1, 'resize', mockHandleResize)
  })

  it('should return expected value', () => {
    const dataState = {
      width: 400,
      height: 800,
      zoom: 1,
    }
    React.useState = jest.fn().mockImplementation(() => [dataState, jest.fn()])
    expect(useWindowSize()).toBe(dataState)
  })

  it('should call lodashDebounce with correct args', () => {
    expect(lodashDebounce).nthCalledWith(1, mockHandleResize, 300)
  })
})
