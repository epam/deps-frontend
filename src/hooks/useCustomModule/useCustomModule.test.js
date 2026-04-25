
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { useCustomization } from '../useCustomization'
import { useCustomModule } from './useCustomModule'

const mockCallback = jest.fn()
const mockedModuleName = 'mockedModuleName'

jest.mock('react', () => mockReact())
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/hooks/useCustomization', () => ({
  useCustomization: jest.fn(() => ({
    module: mockCallback,
  })),
}))

jest.mock('@/selectors/authorization')
jest.mock('@/selectors/customization')
jest.mock('@/utils/env', () => mockEnv)

const Wrapper = () => (
  <div {...useCustomModule(mockedModuleName)} />
)

describe('Hook: useCustomModule', () => {
  beforeEach(() => {
    shallow(<Wrapper />)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call useCustomization once with correct arguments', () => {
    expect(useCustomization).toHaveBeenCalled()
  })

  it('should call userSelector', () => {
    expect(userSelector).toHaveBeenCalled()
  })

  it('should call customizationSelector', () => {
    expect(customizationSelector).toHaveBeenCalled()
  })
})
