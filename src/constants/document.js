
import { DocumentState } from '@/enums/DocumentState'
import { FileExtension } from '@/enums/FileExtension'
import { PipelineStep } from '@/enums/PipelineStep'

export const DELETE = 'delete'
export const CHANGE_DOCUMENT_TYPE = 'changeDocumentType'
export const CHANGE_DOCUMENT_LANGUAGE = 'changeDocumentLanguage'
export const EXTRACT_DATA = 'extractData'
export const RETRY_PREVIOUS_STEP = 'retryPreviousStep'
export const SKIP_VALIDATION = 'skipValidation'
export const RUN_PIPELINE_FROM_STEP = 'runPipelineFromStep'

export const ALLOW_STATE_TO_SKIP_VALIDATION = [
  DocumentState.IN_REVIEW,
]

export const ALLOW_STATE_TO_CHANGE_DOCUMENT_TYPE = [
  DocumentState.IN_REVIEW,
  DocumentState.COMPLETED,
  DocumentState.EXPORTED,
  DocumentState.FAILED,
]

export const FORBIDDEN_EXTENSIONS_TO_OPEN_LT = [
  FileExtension.XLS,
  FileExtension.XLSX,
  FileExtension.XLSM,
  FileExtension.XLTX,
  FileExtension.XLTM,
  FileExtension.CSV,
  FileExtension.DOCX,
]

export const FORBIDDEN_EXTENSIONS_TO_START_REVIEW = [
  FileExtension.MSG,
  FileExtension.EML,
]

export const FORBIDDEN_EXTENSIONS_TO_EXTRACT_DATA = [
  FileExtension.MSG,
  FileExtension.EML,
]

export const FORBIDDEN_EXTENSIONS_TO_LAUNCH_PIPELINE = [
  FileExtension.MSG,
  FileExtension.EML,
]

export const FORBIDDEN_EXTENSIONS_FOR_OUTPUT_ACTIONS = [
  FileExtension.MSG,
  FileExtension.EML,
]

export const FORBIDDEN_STATES_TO_EXTRACT_DATA = [
  DocumentState.NEW,
  DocumentState.UNIFICATION,
  DocumentState.PREPROCESSING,
  DocumentState.IDENTIFICATION,
  DocumentState.VERSION_IDENTIFICATION,
  DocumentState.IMAGE_PREPROCESSING,
  DocumentState.PARSING,
  DocumentState.POSTPROCESSING,
  DocumentState.DATA_EXTRACTION,
  DocumentState.VALIDATION,
  DocumentState.NEEDS_REVIEW,
  DocumentState.FAILED,
  DocumentState.EXCEPTIONAL_QUEUE,
  DocumentState.POSTPONED,
]

export const FORBIDDEN_STATES_TO_CHANGE_DOCUMENT_TYPE = [
  DocumentState.NEW,
  DocumentState.UNIFICATION,
  DocumentState.PREPROCESSING,
  DocumentState.IDENTIFICATION,
  DocumentState.VERSION_IDENTIFICATION,
  DocumentState.IMAGE_PREPROCESSING,
  DocumentState.PARSING,
  DocumentState.POSTPROCESSING,
  DocumentState.DATA_EXTRACTION,
  DocumentState.VALIDATION,
  DocumentState.NEEDS_REVIEW,
  DocumentState.FAILED,
  DocumentState.EXPORTING,
]

export const ALLOW_TO_START_PIPELINE_DOCUMENT_STATES = [
  DocumentState.COMPLETED,
  DocumentState.IN_REVIEW,
  DocumentState.EXPORTED,
  DocumentState.FAILED,
]

export const ERROR_IN_STATE_TO_ALLOWED_TO_RESTART_STEPS = {
  [DocumentState.DATA_EXTRACTION]: [
    PipelineStep.PARSING,
  ],
  [DocumentState.IDENTIFICATION]: [
    PipelineStep.PARSING,
  ],
}

export const ALLOW_TO_START_REVIEW_STATES = [
  DocumentState.COMPLETED,
  DocumentState.NEEDS_REVIEW,
]

export const ALLOW_TO_RETRY_LAST_STEP_STATES = [
  DocumentState.FAILED,
  DocumentState.POSTPONED,
]

export const UNIFIED_DATA_CELLS_BATCH_SIZE = 10
