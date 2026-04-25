
class TabularLayoutRequestConfig {
  constructor ({
    tables,
    rowSpan,
    colSpan,
  }) {
    this.tables = tables
    rowSpan && (this.rowSpan = rowSpan)
    colSpan && (this.colSpan = colSpan)
  }
}

export {
  TabularLayoutRequestConfig,
}
