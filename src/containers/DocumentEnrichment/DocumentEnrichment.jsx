
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useFetchSupplementsQuery } from '@/apiRTK/documentSupplementsApi'
import { NoData } from '@/components/NoData'
import { Spin } from '@/components/Spin'
import { EnrichmentField } from '@/containers/EnrichmentField'
import { InfoPanel } from '@/containers/InfoPanel'
import { DocumentState } from '@/enums/DocumentState'
import { StatusCode } from '@/enums/StatusCode'
import { Localization, localize } from '@/localization/i18n'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { isDocumentTypeFetchingSelector } from '@/selectors/requests'
import { notifyWarning } from '@/utils/notification'
import { AddFieldButton } from './AddFieldButton'
import { Wrapper } from './DocumentEnrichment.styles'

const isUnique = (field, index, self) => (
  index === self.findIndex((t) => t.code === field.code)
)

const getFieldByCode = (fields, code) => fields.find((f) => f.code === code)

const DocumentEnrichment = ({
  documentTypeCode,
  documentId,
  documentState,
  documentTypeExtraFields,
}) => {
  const isDocumentTypeFetching = useSelector(isDocumentTypeFetchingSelector)

  const {
    data: documentSupplements = [],
    isLoading: areDocumentSupplementsFetching,
    error: fetchingSupplementsError,
  } = useFetchSupplementsQuery(documentId, {
    refetchOnMountOrArgChange: true,
  })

  const uniqueFields = [...documentTypeExtraFields, ...documentSupplements].filter(isUnique)

  const isManageFieldsDisabled = (
    documentTypeCode !== UNKNOWN_DOCUMENT_TYPE.code &&
    documentState !== DocumentState.IN_REVIEW
  )

  if (
    fetchingSupplementsError &&
    fetchingSupplementsError.status !== StatusCode.NOT_FOUND
  ) {
    notifyWarning(localize(Localization.DEFAULT_ERROR))
  }

  if (isDocumentTypeFetching || areDocumentSupplementsFetching) {
    return <Spin.Centered spinning />
  }

  const renderActions = () => (
    <AddFieldButton
      disabled={isManageFieldsDisabled}
      documentId={documentId}
      documentSupplements={documentSupplements}
      documentTypeCode={documentTypeCode}
    />
  )

  const renderField = (field) => (
    <EnrichmentField
      key={field.code}
      disabled={isManageFieldsDisabled}
      documentId={documentId}
      documentSupplements={documentSupplements}
      documentTypeCode={documentTypeCode}
      extraField={getFieldByCode(documentTypeExtraFields, field.code)}
      supplement={getFieldByCode(documentSupplements, field.code)}
    />
  )

  return (
    <Wrapper>
      <InfoPanel
        renderActions={renderActions}
        total={uniqueFields.length}
      />
      {
        !uniqueFields.length
          ? <NoData description={localize(Localization.NOTHING_TO_DISPLAY)} />
          : uniqueFields.map(renderField)
      }
    </Wrapper>
  )
}

DocumentEnrichment.propTypes = {
  documentTypeCode: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentState: PropTypes.oneOf(
    Object.values(DocumentState),
  ).isRequired,
  documentTypeExtraFields: PropTypes.arrayOf(documentTypeExtraFieldShape).isRequired,
}

export {
  DocumentEnrichment,
}
