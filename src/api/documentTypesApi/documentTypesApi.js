
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { DocumentTypeV2 } from '@/models/DocumentTypeV2'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'
import { ENV } from '@/utils/env'

const EXTRAS_TO_REQUEST_PARAMETER = {
  [DocumentTypeExtras.EXTRACTION_FIELDS]: 'extraction-fields',
  [DocumentTypeExtras.VALIDATORS]: 'validators',
  ...(ENV.FEATURE_ENRICHMENT && { [DocumentTypeExtras.EXTRA_FIELDS]: 'extra-fields' }),
  ...(ENV.FEATURE_OUTPUT_PROFILES && { [DocumentTypeExtras.PROFILES]: 'profiles' }),
  ...(ENV.FEATURE_CLASSIFIER && { [DocumentTypeExtras.CLASSIFIERS]: 'classifiers' }),
  ...(ENV.FEATURE_LLM_DATA_EXTRACTION && { [DocumentTypeExtras.LLM_EXTRACTORS]: 'llm-extractors' }),
  [DocumentTypeExtras.WORKFLOW_CONFIGURATIONS]: 'workflow-configurations',
}

const fetchDocumentTypes = async (extractionType, workflowConfigurations = true) => {
  const { result } = await apiRequest.get(apiMap.apiGatewayV2.v5.documentTypes({
    extractionType,
    workflowConfigurations,
  }))
  return result.map(DocumentTypeV2.toDocumentTypeV1)
}

const fetchDocumentType = async (typeCode, extras = []) => {
  const extrasParameters = extras.map((extra) => EXTRAS_TO_REQUEST_PARAMETER[extra])
  const type = await apiRequest.get(apiMap.apiGatewayV2.v5.documentTypes.documentType.extras(typeCode, extrasParameters))
  return DocumentTypeV2.toExtendedDocumentType(type)
}

const createDocumentType = (documentTypeData) => apiRequest.post(apiMap.apiGatewayV2.v5.documentTypes.attachExtractor(), documentTypeData)

const validateField = (documentTypeId, validatorCode, documentId) =>
  apiRequest.post(
    apiMap.apiGatewayV2.v5.documentTypes.documentType.validators.validator.validate(
      documentTypeId,
      validatorCode,
    ),
    { documentId },
  )

export {
  fetchDocumentTypes,
  fetchDocumentType,
  createDocumentType,
  validateField,
}
