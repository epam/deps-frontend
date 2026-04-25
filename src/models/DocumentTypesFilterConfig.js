
class DocumentTypesFilterConfig {
  constructor ({
    dateRange = [],
    name = '',
    engine = [],
    extractionType = '',
    language = [],
    sortDirect = '',
    sortField = '',
  } = {}) {
    this.dateRange = dateRange
    this.name = name
    this.engine = engine
    this.extractionType = extractionType
    this.language = language
    this.sortDirect = sortDirect
    this.sortField = sortField
  }
}

const BASE_DOCUMENT_TYPES_FILTER_CONFIG = new DocumentTypesFilterConfig()

export {
  DocumentTypesFilterConfig,
  BASE_DOCUMENT_TYPES_FILTER_CONFIG,
}
