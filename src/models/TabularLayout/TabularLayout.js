
class TabularLayout {
  constructor ({
    id,
    tenantId,
    parsingType,
    extractedProperties,
    sheets,
    tables,
  }) {
    this.id = id
    this.tenantId = tenantId
    this.parsingType = parsingType
    this.extractedProperties = extractedProperties
    this.sheets = sheets
    this.tables = tables
  }
}

export {
  TabularLayout,
}
