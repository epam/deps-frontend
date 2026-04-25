
import { ExtractionType } from '@/enums/ExtractionType'

export const EXPORTABLE_EXTRACTION_TYPES = [
  ExtractionType.PROTOTYPE,
  ExtractionType.AI_PROMPTED,
]

export const EXPORT_FIELDS = {
  NAME: 'name',
  DESCRIPTION: 'description',
  ENGINE: 'engine',
  EXTRACTION_TYPE: 'extractionType',
  LANGUAGE: 'language',
  GEN_AI_FIELDS: 'genAIFields',
  CROSS_FIELD_VALIDATORS: 'crossFieldValidators',
  LLM_EXTRACTORS: 'llmExtractors',
}
