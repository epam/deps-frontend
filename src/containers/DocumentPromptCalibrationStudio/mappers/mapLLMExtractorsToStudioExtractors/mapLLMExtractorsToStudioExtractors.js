
import { Extractor } from '@/containers/PromptCalibrationStudio/viewModels'
import { LLMSettings } from '@/models/LLMProvider'

export const mapLLMExtractorsToStudioExtractors = (llmExtractors) => (
  llmExtractors.map((llmExtractor) => {
    const {
      extractorId,
      name,
      extractionParams,
      llmReference,
    } = llmExtractor

    const {
      customInstruction,
      groupingFactor,
      pageSpan,
      temperature,
      topP,
    } = extractionParams

    const model = LLMSettings.settingsToLLMType(llmReference.provider, llmReference.model)

    return new Extractor({
      id: extractorId,
      name,
      customInstruction,
      groupingFactor,
      model,
      pageSpan,
      temperature,
      topP,
    })
  })
)
