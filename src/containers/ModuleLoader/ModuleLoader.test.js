
import { Spin } from '@/components/Spin'
import { useCustomization } from '@/hooks/useCustomization'
import { ModuleLoader } from './ModuleLoader'

jest.mock('@/hooks/useCustomization', () => ({
  useCustomization: jest.fn(() => ({
    ready: true,
    failed: false,
    module: jest.fn(),
  })),
}))

describe('Containers: ModuleLoader', () => {
  it('should return child in case of ready true', () => {
    const child = <div>Child Component</div>
    expect(ModuleLoader({
      url: 'mockUrl',
      children: () => child,
    })).toEqual(child)
  })

  it('should return spinner in case of loading', () => {
    useCustomization.mockImplementationOnce(jest.fn(() => ({
      ready: false,
      failed: false,
      module: jest.fn(),
    })))
    const spinner = <Spin spinning />
    expect(ModuleLoader({ url: 'mockUrl' })).toEqual(spinner)
  })

  it('should return error in case of failed true', () => {
    useCustomization.mockImplementationOnce(jest.fn(() => ({
      ready: false,
      failed: true,
      module: jest.fn(),
    })))
    expect(ModuleLoader).toThrow()
  })
})
