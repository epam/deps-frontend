
import { StatusCode } from '@/enums/StatusCode'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const fetchOutputProfiles = async (documentTypeId) => {
  try {
    return await apiRequest.get(
      apiMap.outputExporting.v1.documentTypes.outputProfiles(documentTypeId),
    )
  } catch (e) {
    if (e.request.status === StatusCode.NOT_FOUND) {
      return { profiles: [] }
    }
    throw e
  }
}

const updateOutputProfile = (
  documentTypeId,
  profileId,
  data,
) => apiRequest.put(
  apiMap.outputExporting.v1.documentTypes.outputProfile(documentTypeId, profileId),
  data,
)

const deleteOutputProfile = (
  documentTypeId,
  profileId,
) => apiRequest.delete(
  apiMap.outputExporting.v1.documentTypes.outputProfile(documentTypeId, profileId),
)

const createProfileOutput = ({
  documentId,
  documentTypeId,
  profileId,
  format,
}) => (
  apiRequest.post(apiMap.outputExporting.v1.document.outputs(documentId), {
    documentTypeId,
    profileId,
    format,
  })
)

const createProfileOutputV2 = ({
  documentId,
  documentTypeId,
  profileId,
  format,
}) => (
  apiRequest.post(apiMap.outputExporting.v2.document.outputs(documentId), {
    documentTypeId,
    profileId,
    format,
  })
)

const fetchDocumentOutputs = (documentId) => (
  apiRequest.get(apiMap.apiGatewayV2.v5.documents.document.outputs(documentId))
)

const deleteDocumentOutput = (documentId, outputId) => (
  apiRequest.delete(apiMap.outputExporting.v1.document.output(documentId, outputId))
)

const createOutputProfile = ({
  documentTypeId,
  name,
  schema,
  format,
}) => (
  apiRequest.post(
    apiMap.outputExporting.v1.documentTypes.outputProfiles(documentTypeId), {
      name,
      schema,
      format,
    },
  )
)

export {
  fetchOutputProfiles,
  updateOutputProfile,
  deleteOutputProfile,
  createProfileOutput,
  createProfileOutputV2,
  fetchDocumentOutputs,
  deleteDocumentOutput,
  createOutputProfile,
}
