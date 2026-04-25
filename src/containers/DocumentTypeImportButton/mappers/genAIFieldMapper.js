
const mapFieldToGenAIFieldCreationRequest = (field, llmExtractors, llmExtractorsIdsMapping) => {
  const {
    confidential,
    fieldMeta,
    fieldType,
    extractorId,
    name,
    order,
    readOnly,
    required,
  } = field

  const llmExtractor = llmExtractors.find((extractor) => extractor.extractorId === extractorId)
  const query = llmExtractor.queries.find((query) => query.code === field.code)

  const fieldData = {
    confidential,
    fieldMeta,
    fieldType,
    extractorId: llmExtractorsIdsMapping[llmExtractor.extractorId],
    name,
    order,
    readOnly,
    required,
  }

  const queryData = {
    shape: query.shape,
    workflow: query.workflow,
  }

  return {
    fieldData,
    queryData,
  }
}

export {
  mapFieldToGenAIFieldCreationRequest,
}
