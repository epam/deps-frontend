
class HTCellRange {
  static removeDuplications (range) {
    const withoutDuplications = []
    range.forEach((cell) => {
      const isCellCoordsUnique = !withoutDuplications.find((uniqueCell) => uniqueCell[0] === cell[0] && uniqueCell[1] === cell[1])
      if (isCellCoordsUnique) {
        withoutDuplications.push(cell)
      }
    })
    return withoutDuplications
  }

  static getTopLeftCoordinates (range) {
    let topRow = Infinity
    let leftColumn = Infinity

    range.forEach(([row1, col1, row2, col2]) => {
      const minRow = row2 !== undefined ? Math.min(row1, row2) : row1
      const minColumn = col2 !== undefined ? Math.min(col1, col2) : col1

      if (minRow < topRow) {
        topRow = minRow
        leftColumn = minColumn
      }

      if (minRow === topRow && minColumn < leftColumn) {
        leftColumn = minColumn
      }
    })

    return [topRow, leftColumn]
  }
}

export { HTCellRange }
