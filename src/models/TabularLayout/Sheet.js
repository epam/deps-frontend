
class Sheet {
  constructor ({
    id,
    title,
    isHidden,
    tables,
    images,
    tableIds,
  }) {
    this.id = id
    this.title = title
    this.isHidden = isHidden
    this.tables = tables
    this.images = images
    this.tableIds = tableIds
  }
}

export {
  Sheet,
}
