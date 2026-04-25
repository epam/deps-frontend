
import { mockReact } from '@/mocks/mockReact'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import React from 'react'
import { useDynamicScript } from '@/hooks/useDynamicScript'
import { getSharedModule } from '@/utils/moduleFederation'
import { customizationCache } from './customizationCache'
import { useCustomization } from './useCustomization'

jest.mock('react', () => mockReact())
const mockModule = jest.fn()
jest.mock('@/utils/moduleFederation', () => ({
  getSharedModule: jest.fn(() => Promise.resolve({ default: mockModule })),
}))
jest.mock('@/hooks/useDynamicScript', () => ({
  useDynamicScript: jest.fn(() => ({})),
}))
jest.mock('./customizationCache', () => ({
  customizationCache: {
    has: jest.fn(() => false),
    get: jest.fn(() => mockModule),
    set: jest.fn(),
  },
}))

const mockUrl = 'url'

const Wrapper = () => (
  <div {...useCustomization(mockUrl)} />
)

describe('Hook: useCustomization', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be called first time with provided url', () => {
    shallow(<Wrapper />)
    expect(useDynamicScript).toHaveBeenNthCalledWith(1, mockUrl)
  })

  it('should call getSharedModule for the first time with correct arguments', () => {
    useDynamicScript.mockReturnValueOnce({
      ready: true,
      failed: false,
    })

    shallow(<Wrapper />)

    expect(getSharedModule).toHaveBeenNthCalledWith(1, mockUrl, `./${mockUrl}`)
  })

  it('should call customizationCache.set for the first time with correct arguments', async () => {
    useDynamicScript.mockReturnValueOnce({
      ready: true,
      failed: false,
    })

    shallow(<Wrapper />)
    await flushPromises()
    expect(customizationCache.set).toHaveBeenNthCalledWith(1, mockUrl, mockModule)
  })

  it('should NOT call getSharedModule in case dynamic script hook returns ready and cache contains it', () => {
    customizationCache.has.mockReturnValueOnce(true)
    useDynamicScript.mockReturnValueOnce({
      ready: true,
      failed: false,
    })

    shallow(<Wrapper />)

    expect(getSharedModule).not.toHaveBeenCalled()
  })

  it('should call customizationCache.get for the first time with correct arguments', () => {
    customizationCache.has.mockReturnValueOnce(true)
    shallow(<Wrapper />)

    expect(customizationCache.get).toHaveBeenNthCalledWith(1, mockUrl)
  })

  it('should NOT call getSharedModule in case dynamic script hook returns not ready', () => {
    useDynamicScript.mockReturnValueOnce({
      ready: false,
      failed: true,
    })

    shallow(<Wrapper />)

    expect(getSharedModule).not.toHaveBeenCalled()
  })

  it('should return expected API', () => {
    useDynamicScript.mockReturnValueOnce({
      ready: true,
      failed: false,
    })

    const expectedKeys = [
      'failed',
      'ready',
      'module',
    ]

    const wrapper = shallow(<Wrapper />)
    const props = wrapper.props()

    expect(Object.keys(props)).toHaveLength(expectedKeys.length)

    expectedKeys.forEach((key) => {
      expect(Object.keys(props)).toContain(key)
    })
  })
})
