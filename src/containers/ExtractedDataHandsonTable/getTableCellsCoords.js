
const getTableCellsCoords = (selection, mergeCells) => {
  const cells = []
  for (let row = selection.start.row; row <= selection.end.row; row++) {
    for (let col = selection.start.col; col <= selection.end.col; col++) {
      const mergedCell = mergeCells.find((mc) => mc.col === col && mc.row === row)
      if (mergedCell) {
        cells.push({
          start: {
            row,
            col,
          },
          end: {
            row: row + mergedCell.rowspan - 1,
            col: col + mergedCell.colspan - 1,
          },
        })
        break
      }

      if (
        !cells.length ||
        !cells.every((c) => (
          c.start.row <= row &&
          c.end.row >= row &&
          c.start.col <= col &&
          c.end.col >= col
        ))
      ) {
        cells.push({
          start: {
            row,
            col,
          },
          end: {
            row,
            col,
          },
        })
      }
    }
  }

  return cells
}

export {
  getTableCellsCoords,
}
