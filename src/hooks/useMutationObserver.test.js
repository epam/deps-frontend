
import { mockReact } from '@/mocks/mockReact'
import { shallow } from 'enzyme'
import { useMutationObserver } from './useMutationObserver'

let mockOnUnmount

jest.mock('react', () => mockReact({
  mockUseEffect: jest.fn((f) => {
    mockOnUnmount = f()
  }),
}))

const handlerMock = jest.fn()
const elementMock = document.createElement('textarea')
const Wrapper = () => {
  useMutationObserver(elementMock, handlerMock)
  return <div />
}
const observeCallback = jest.fn()
const disconnectCAllback = jest.fn()

jest.spyOn(window, 'MutationObserver').mockImplementation(function MutationObserver () {
  this.observe = observeCallback
  this.disconnect = disconnectCAllback
})

describe('Hook: useMutationObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should add mutationObserver when component mounting', () => {
    shallow(<Wrapper />)
    expect(observeCallback).toHaveBeenCalledTimes(1)
  })

  it('should disconect mutationObserver when component unmounting', () => {
    shallow(<Wrapper />)
    mockOnUnmount()
    expect(disconnectCAllback).toBeCalledTimes(1)
  })

  it('should not call mutationObserver when prop element is absent', () => {
    const LocalWrapper = () => {
      useMutationObserver(null, handlerMock)
      return <div />
    }
    shallow(<LocalWrapper />)
    expect(observeCallback).toBeCalledTimes(0)
  })
})
