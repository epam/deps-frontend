
export const mapExtractorToLLMExtractor = (extractor) => {
  const [provider, model] = extractor.model.split('@')

  const {
    temperature,
    topP,
    groupingFactor,
    customInstruction,
    pageSpan,
    name,
  } = extractor

  return {
    extractorName: name,
    provider,
    model,
    extractionParams: {
      temperature,
      topP,
      groupingFactor,
      customInstruction: customInstruction || null,
      pageSpan,
    },
  }
}
