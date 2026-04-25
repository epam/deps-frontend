
import { DocumentTable } from './DocumentTable'

const mockUdCell = {
  coordinates: {
    colspan: 0,
    rowspan: 0,
    row: 1,
    column: 0,
  },
  value: {
    content: 'mock content',
    confidence: 1,
  },
}

const mockCellCoordinates = {
  row: 1,
  col: 0,
}

const mockRange = {
  from: mockCellCoordinates,
  to: mockCellCoordinates,
}

const mockUdSource = {
  cells: [mockUdCell],
}

describe('model: DocumentTable', () => {
  describe('method: getCellCoordinatesByRange', () => {
    it('should return correct cell coordinates', () => {
      const expected = [[1, 0]]

      expect(DocumentTable.getCellCoordinatesByRange(mockUdSource, mockRange)).toEqual(expected)
    })

    it('should return empty array in case of no cells are in range', () => {
      mockUdCell.coordinates.row = 12

      const expected = []
      expect(DocumentTable.getCellCoordinatesByRange(mockUdSource, mockRange)).toEqual(expected)
    })
  })
})
