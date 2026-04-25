
import { LabelType } from 'labeling-tool/lib/models/Label'
import { FORBIDDEN_SPECIAL_SYMBOLS } from '@/constants/regexp'
import { apiMap } from '@/utils/apiMap'
import { apiRequest } from '@/utils/apiRequest'

const mapLabelToVersionMarkup = ({ labels }, fields) => (
  labels
    .filter((label) => label.type !== LabelType.UNASSIGNED)
    .reduce((acc, label) => {
      const field = fields.find((field) => {
        const newlyCreatedFieldCode = field.name.replace(FORBIDDEN_SPECIAL_SYMBOLS, '')

        return (
          field.code === label.fieldCode ||
          newlyCreatedFieldCode === label.fieldCode
        )
      })

      if (!field) {
        return acc
      }

      if (!acc[field.code]) {
        acc[field.code] = []
      }

      const fieldMarkupCoords = [
        label.x,
        label.y,
        label.w,
        label.h,
      ]

      acc[field.code].push(fieldMarkupCoords)
      return acc
    }, {})
)

const mapMarkupToDTO = (markup, referencePages, templateFields) => (
  referencePages.reduce((acc, page, index) => {
    acc[page.id] = {}
    const pageMarkup = markup?.[index + 1]

    if (!pageMarkup) {
      return acc
    }

    acc[page.id] = mapLabelToVersionMarkup(pageMarkup, templateFields)
    return acc
  }, {})
)

const getMarkupTypes = (markups, templateFields) => (
  Object.keys(markups).reduce((acc, fieldId) => {
    const field = templateFields.find((f) => f.code === fieldId)

    acc[fieldId] = field.fieldType
    return acc
  }, {})
)

const createTemplate = (template) => apiRequest.post(apiMap.apiGatewayV2.v5.documentTypes.template(), template)

const fetchTemplateVersions = async (templateId) => {
  const response = await apiRequest.get(apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions(templateId))
  return response?.versions ?? []
}

const uploadTemplateVersionFile = (
  {
    code,
    file,
    name,
    description,
    markupAutomatically = false,
  },
  onSuccess,
  onError,
  onProgress,
) => {
  const formData = new FormData()
  formData.append('files', file)
  formData.append('name', name)
  formData.append('description', description)
  formData.append('markupAutomatically', markupAutomatically)

  return apiRequest.formPost(apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions(code), formData, {
    onSuccess,
    onError,
    onProgress,
  })
}

const saveVersionMarkup = async ({
  markup,
  referencePages,
  templateFields,
  templateId,
  versionId,
}) => {
  const vpMarkupByPageDTO = mapMarkupToDTO(markup, referencePages, templateFields)
  const DTOs = Object.entries(vpMarkupByPageDTO).map(([referencePage, markups]) => ({
    referencePage,
    markups,
    markupTypes: getMarkupTypes(markups, templateFields),
  }))

  let error

  try {
    for await (const DTO of DTOs) {
      await apiRequest.put(apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions.version.markups(templateId, versionId), DTO)
    }
  } catch (e) {
    error = e
  }

  return error ? Promise.reject(error) : Promise.resolve()
}

const fetchTemplateVersion = (templateId, versionId) => (
  apiRequest.get(apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions.version(templateId, versionId))
)

const deleteTemplateVersion = (templateId, versionId) =>
  apiRequest.delete(apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions.delete(templateId, [versionId]))

const updateTemplateVersionName = (
  templateId,
  { id: versionId, name },
) => (
  apiRequest.patch(
    apiMap.apiGatewayV2.v5.documentTypes.documentType.template.versions.version(templateId, versionId),
    { name },
  )
)

const fetchTemplateMarkupState = (
  templateId,
) => (
  apiRequest.get(
    apiMap.apiGatewayV2.v5.sagas.saga.state(templateId),
  )
)

export {
  fetchTemplateVersions,
  createTemplate,
  uploadTemplateVersionFile,
  saveVersionMarkup,
  fetchTemplateVersion,
  deleteTemplateVersion,
  updateTemplateVersionName,
  fetchTemplateMarkupState,
}
