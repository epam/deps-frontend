
import { mockReact } from '@/mocks/mockReact'
import { shallow } from 'enzyme'
import { dynamicScriptCache } from './dynamicScriptCache'
import { useDynamicScript } from './useDynamicScript'

let mockOnUnmount

jest.mock('react', () => mockReact({
  mockUseEffect: jest.fn((f) => {
    mockOnUnmount = f()
  }),
}))
jest.mock('@/utils/moduleFederation', () => ({
  getSharedModule: jest.fn(() => Promise.resolve({ default: jest.fn() })),
}))
jest.mock('./dynamicScriptCache', () => ({
  dynamicScriptCache: {
    has: jest.fn(() => false),
  },
}))

const mockUrl = 'url'

const Wrapper = () => (
  <div {...useDynamicScript(mockUrl)} />
)

const mockNode = document.createElement('script')
const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockNode)
const appendChildSpy = jest.spyOn(document.head, 'appendChild')
const removeChildSpy = jest.spyOn(document.head, 'removeChild')

describe('Hook: useDynamicScript', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should NOT call createElement in case url is not provided', () => {
    const LocalWrapper = () => (
      <div {...useDynamicScript('')} />
    )

    shallow(<LocalWrapper />)

    expect(createElementSpy).not.toHaveBeenCalled()
  })

  it('should NOT call createElement in case dynamicScriptCache contains url', () => {
    dynamicScriptCache.has.mockImplementationOnce(() => true)
    const LocalWrapper = () => (
      <div {...useDynamicScript('test')} />
    )

    shallow(<LocalWrapper />)
    expect(createElementSpy).not.toHaveBeenCalled()
  })

  it('should call createElement for the first time', () => {
    shallow(<Wrapper />)

    expect(createElementSpy).toHaveBeenCalledTimes(1)
  })

  it('should created element that has src equal to url in case url is provided to hook', async () => {
    shallow(<Wrapper />)

    expect(mockNode.src).toEqual(`http://localhost/${mockUrl}`)
  })

  it('should created element that has defer in case url is provided to hook', async () => {
    shallow(<Wrapper />)

    expect(mockNode.defer).toBe(true)
  })

  it('should call appendChild for the first time with node element', () => {
    shallow(<Wrapper />)

    expect(appendChildSpy).toHaveBeenNthCalledWith(1, mockNode)
  })

  it('should call removeChild first time if unmount function has been called', async () => {
    shallow(<Wrapper />)

    const cleanup = await mockOnUnmount
    cleanup()

    expect(removeChildSpy).toHaveBeenCalledTimes(1)
  })

  it('should return expected API', () => {
    const expectedKeys = [
      'failed',
      'ready',
    ]

    const wrapper = shallow(<Wrapper />)
    const props = wrapper.props()

    expect(Object.keys(props)).toHaveLength(expectedKeys.length)

    expectedKeys.forEach((key) => {
      expect(Object.keys(props)).toContain(key)
    })
  })
})
