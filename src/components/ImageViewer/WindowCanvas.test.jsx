
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import flushPromises from 'flush-promises'
import { WindowCanvas } from './WindowCanvas'

jest.mock('@/utils/env', () => mockEnv)
// TODO: #3256
jest.mock('react', () => {
  let called = false
  return {
    ...jest.requireActual('react'),
    useEffect: (effect) => {
      if (!called) {
        called = true
        return effect()
      }
    },
  }
})

jest.mock('@/utils/image', () => ({
  loadImageURL: jest.fn(() => Promise.resolve({
    width: 100,
    height: 100,
  })),
}))

jest.mock('@/hooks/useWindowSize', () => ({
  useWindowSize: () => ({
    width: 100,
  }),
}))

describe('Component: WindowCanvas', () => {
  let defaultProps
  let wrapper

  beforeEach(async () => {
    defaultProps = {
      imageUrl: 'http://sample.jpeg',
      rotationAngle: 0,
    }

    wrapper = shallow(<WindowCanvas {...defaultProps} />)
    await flushPromises()
    wrapper.update()
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
