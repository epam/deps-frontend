
export class BatchFilesFilterConfig {
  constructor ({
    name = '',
    documentTypeId = '',
    status = [],
    engine = [],
    llmType = '',
    parsingFeatures = [],
    sortField = '',
    sortDirect = '',
  } = {}) {
    this.name = name
    this.documentTypeId = documentTypeId
    this.status = Array.isArray(status) ? status : [status]
    this.engine = Array.isArray(engine) ? engine : [engine]
    this.llmType = llmType
    this.parsingFeatures = Array.isArray(parsingFeatures) ? parsingFeatures : [parsingFeatures]
    this.sortField = sortField
    this.sortDirect = sortDirect
  }
}
