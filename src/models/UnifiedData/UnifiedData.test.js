
import { UnifiedData } from './UnifiedData'

const mockUnifiedData = {
  1: [
    {
      id: 'source-1',
      blobName: 'blob-1.png',
    },
    {
      id: 'source-2',
      blobName: 'blob-2.png',
    },
  ],
  2: [
    {
      id: 'source-3',
      blobName: 'blob-3.png',
    },
  ],
  3: [
    {
      id: 'source-4',
    },
    {
      id: 'source-5',
      blobName: 'blob-5.png',
    },
  ],
}

describe('getBboxSourceIdByPage', () => {
  test('returns the last source ID with blobName for a given page', () => {
    const result = UnifiedData.getBboxSourceIdByPage(mockUnifiedData, 1)

    expect(result).toBe('source-2')
  })

  test('returns null when page does not exist', () => {
    const result = UnifiedData.getBboxSourceIdByPage(mockUnifiedData, 999)

    expect(result).toBeNull()
  })

  test('returns null when unifiedData is null', () => {
    const result = UnifiedData.getBboxSourceIdByPage(null, 1)

    expect(result).toBeNull()
  })
})

describe('getTheLastSourceIdByPage', () => {
  test('returns the last source ID for a given page', () => {
    const result = UnifiedData.getTheLastSourceIdByPage(mockUnifiedData, 1)

    expect(result).toBe('source-2')
  })

  test('returns null when page does not exist', () => {
    const result = UnifiedData.getTheLastSourceIdByPage(mockUnifiedData, 999)

    expect(result).toBeNull()
  })

  test('returns null when unifiedData is null', () => {
    const result = UnifiedData.getTheLastSourceIdByPage(null, 1)

    expect(result).toBeNull()
  })
})

describe('getBlobNameByPage', () => {
  test('returns the last blobName with blobName for a given page', () => {
    const result = UnifiedData.getBlobNameByPage(mockUnifiedData, 1)

    expect(result).toBe('blob-2.png')
  })

  test('returns null when page does not exist', () => {
    const result = UnifiedData.getBlobNameByPage(mockUnifiedData, 999)

    expect(result).toBeNull()
  })

  test('returns null when unifiedData is null', () => {
    const result = UnifiedData.getBlobNameByPage(null, 1)

    expect(result).toBeNull()
  })

  test('returns null when no items have blobName', () => {
    const dataWithoutBlob = {
      1: [
        {
          id: 'source-1',
        },
        {
          id: 'source-2',
        },
      ],
    }

    const result = UnifiedData.getBlobNameByPage(dataWithoutBlob, 1)

    expect(result).toBeNull()
  })
})

describe('getBlobNameBySourceId', () => {
  test('returns blobName for a given sourceId', () => {
    const result = UnifiedData.getBlobNameBySourceId(mockUnifiedData, 'source-3')

    expect(result).toBe('blob-3.png')
  })

  test('returns null when sourceId does not exist', () => {
    const result = UnifiedData.getBlobNameBySourceId(mockUnifiedData, 'non-existent')

    expect(result).toBeNull()
  })

  test('returns null when unifiedData is null', () => {
    const result = UnifiedData.getBlobNameBySourceId(null, 'source-1')

    expect(result).toBeNull()
  })

  test('returns null when item has no blobName', () => {
    const result = UnifiedData.getBlobNameBySourceId(mockUnifiedData, 'source-4')

    expect(result).toBeNull()
  })
})

describe('getPagesQuantity', () => {
  test('returns the number of pages in unifiedData', () => {
    const result = UnifiedData.getPagesQuantity(mockUnifiedData)

    expect(result).toBe(3)
  })

  test('returns 0 when unifiedData is null', () => {
    const result = UnifiedData.getPagesQuantity(null)

    expect(result).toBe(0)
  })

  test('returns 0 when unifiedData is empty', () => {
    const result = UnifiedData.getPagesQuantity({})

    expect(result).toBe(0)
  })
})

describe('getBlobNames', () => {
  test('returns array of blob names for all pages', () => {
    const result = UnifiedData.getBlobNames(mockUnifiedData)

    expect(result).toEqual(['blob-2.png', 'blob-3.png', 'blob-5.png'])
  })

  test('returns array with null when page has no blob', () => {
    const dataWithNullBlob = {
      1: [
        {
          id: 'source-1',
        },
      ],
      2: [
        {
          id: 'source-2',
          blobName: 'blob-2.png',
        },
      ],
    }

    const result = UnifiedData.getBlobNames(dataWithNullBlob)

    expect(result).toEqual([null, 'blob-2.png'])
  })

  test('returns empty array when unifiedData is empty', () => {
    const result = UnifiedData.getBlobNames({})

    expect(result).toEqual([])
  })
})
