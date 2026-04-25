import { FileExtension } from '@/enums/FileExtension'
import { MimeType } from '@/enums/MimeType'

export const FORM_FIELD_CODES = {
  DOCUMENT_TYPE_NAME: 'name',
  FILE: 'file',
}

export const initialValues = {
  currentRequestsCount: 0,
  totalRequestsCount: 0,
  llmExtractorsIdsMapping: null,
  fieldsCodesMapping: null,
}

export const CREATE_DOCUMENT_TYPE_REQUEST_COUNT = 1
export const CREATE_GEN_AI_FIELD_REQUESTS_COUNT = 2

export const SUPPORTED_EXTENSIONS = [FileExtension.JSON]
export const SUPPORTED_FORMATS = [MimeType.APPLICATION_JSON]
