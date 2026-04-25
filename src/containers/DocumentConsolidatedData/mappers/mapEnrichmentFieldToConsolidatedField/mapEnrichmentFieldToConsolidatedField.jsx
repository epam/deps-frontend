
import { DocumentConsolidatedField } from '@/containers/DocumentConsolidatedData/DocumentConsolidatedField'
import { EnrichmentField } from '@/containers/EnrichmentField'
import { DocumentState } from '@/enums/DocumentState'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'

const getFieldByCode = (fields, code) => fields.find((f) => f.code === code)

export const mapEnrichmentFieldToConsolidatedField = ({
  field,
  documentState,
  documentId,
  documentTypeCode,
  documentSupplements,
  documentTypeExtraFields,
}) => {
  const { code, order, name, type } = field

  const isManageFieldsDisabled = (
    documentTypeCode !== UNKNOWN_DOCUMENT_TYPE.code &&
    documentState !== DocumentState.IN_REVIEW
  )

  return new DocumentConsolidatedField({
    code,
    name,
    order,
    type,
    render: () => (
      <EnrichmentField
        disabled={isManageFieldsDisabled}
        documentId={documentId}
        documentSupplements={documentSupplements}
        documentTypeCode={documentTypeCode}
        extraField={getFieldByCode(documentTypeExtraFields, code)}
        supplement={getFieldByCode(documentSupplements, code)}
      />
    ),
  })
}
