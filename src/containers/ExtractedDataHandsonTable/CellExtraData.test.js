
import { mockEnv } from '@/mocks/mockEnv'
import { renderCellExtraData } from './renderCellExtraData'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: CellExtraData', () => {
  it('should return expected HTML node', () => {
    const arg = {
      errors: ['mockError'],
      warnings: ['mockWarning'],
      comments: ['mockComment'],
      modified: true,
      confidence: 10,
    }

    const result = renderCellExtraData(arg)
    expect(result).toMatchSnapshot()
  })

  it('should return expected HTML node (no args)', () => {
    const arg = {
    }

    const result = renderCellExtraData(arg)
    expect(result).toMatchSnapshot()
  })
})
