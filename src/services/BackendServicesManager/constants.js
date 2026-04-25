
import { KnownBackendService } from '@/enums/KnownBackendService'

export const KnownServiceToFeatureMap = {
  [KnownBackendService.TABLES]: [
    'FEATURE_TABLE_DETECTION',
  ],
  [KnownBackendService.OMR]: [
    'FEATURE_OMR_AREA',
  ],
  [KnownBackendService.TEMPLATE]: [
    'FEATURE_MANAGE_TEMPLATE_VERSIONS',
    'FEATURE_TEMPLATES',
  ],
  [KnownBackendService.OUTPUT_EXPORTING]: [
    'FEATURE_OUTPUT_PROFILES',
  ],
  [KnownBackendService.PROTOTYPE]: [
    'FEATURE_PROTOTYPE_REFERENCE_LAYOUT',
    'FEATURE_PROTOTYPES',
  ],
  [KnownBackendService.PROMPTER]: [
    'FEATURE_GEN_AI_KEY_VALUE_FIELDS',
  ],
  [KnownBackendService.EVENT_RELAY]: [
    'FEATURE_SERVER_SENT_EVENTS',
  ],
  [KnownBackendService.FILES_BATCH]: [
    'FEATURE_FILES_BATCH',
    'FEATURE_PDF_SPLITTING',
  ],
  [KnownBackendService.GROUPS]: [
    'FEATURE_DOCUMENT_TYPES_GROUPS',
  ],
  [KnownBackendService.ENRICHMENT]: [
    'FEATURE_ENRICHMENT',
  ],
  [KnownBackendService.AI_FUSION]: [
    'FEATURE_LLM_DATA_EXTRACTION',
    'FEATURE_GEN_AI_CHAT',
    'FEATURE_HIDDEN_LLM_PROVIDERS',
    'FEATURE_LLM_EXTRACTORS',
    'FEATURE_PROMPT_CALIBRATION_STUDIO',
  ],
  [KnownBackendService.CLASSIFICATION]: [
    'FEATURE_CLASSIFIER',
  ],
  [KnownBackendService.CLOUD_EXTRACTION]: [
    'FEATURE_AZURE_CLOUD_NATIVE_EXTRACTOR',
  ],
}
