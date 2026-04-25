
const mapLLMExtractorToCreationRequest = (llmExtractor) => {
  const { llmReference, name: extractorName, extractionParams } = llmExtractor

  return {
    extractorName,
    provider: llmReference.provider,
    model: llmReference.model,
    extractionParams,
  }
}

export {
  mapLLMExtractorToCreationRequest,
}
