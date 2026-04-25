
class GroupDocumentTypesFilterConfig {
  constructor ({
    name = '',
    extractionType = [],
    sortDirect = '',
    sortField = '',
    classifier = '',
  } = {}) {
    this.name = name
    this.extractionType = extractionType
    this.classifier = classifier
    this.sortDirect = sortDirect
    this.sortField = sortField
  }
}

const BASE_GROUP_DOCUMENT_TYPES_FILTER_CONFIG = new GroupDocumentTypesFilterConfig()

export {
  GroupDocumentTypesFilterConfig,
  BASE_GROUP_DOCUMENT_TYPES_FILTER_CONFIG,
}
