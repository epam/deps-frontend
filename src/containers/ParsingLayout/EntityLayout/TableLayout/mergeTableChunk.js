
const mergeTableChunk = (tablesList, tableChunk, parentTableId) => {
  const parentTable = tablesList.find((table) => table.id === parentTableId)

  if (!parentTable) {
    return [
      ...tablesList,
      {
        ...tableChunk,
        id: parentTableId,
      },
    ]
  }

  return tablesList.map((table) => {
    if (table.id !== parentTableId) {
      return table
    }

    return {
      ...table,
      cells: [
        ...table.cells,
        ...tableChunk.cells.map((cell) => ({
          ...cell,
          rowIndex: cell.rowIndex + table.rowCount,
          initialPosition: cell.initialPosition ?? {
            columnIndex: cell.columnIndex,
            rowIndex: cell.rowIndex,
            tableId: tableChunk.id,
            page: tableChunk.page,
          },
        })),
      ],
      rowCount: table.rowCount + tableChunk.rowCount,
      columnCount: Math.max(table.columnCount, tableChunk.columnCount),
    }
  })
}

export {
  mergeTableChunk,
}
