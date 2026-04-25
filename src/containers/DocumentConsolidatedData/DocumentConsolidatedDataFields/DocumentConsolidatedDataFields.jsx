
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NoData } from '@/components/NoData'
import { UiKeys } from '@/constants/navigation'
import { getExtractedDataToDisplay } from '@/containers/DocumentConsolidatedData/getExtractedDataToDisplay'
import {
  mapEnrichmentFieldToConsolidatedField,
  mapExtractedDataFieldToConsolidatedField,
} from '@/containers/DocumentConsolidatedData/mappers'
import { Localization, localize } from '@/localization/i18n'
import { documentSupplementShape } from '@/models/DocumentSupplement'
import {
  activeFieldTypesSelector,
  documentSelector,
  documentTypeSelector,
} from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { LocalBoundary } from './DocumentConsolidatedDataFields.styles'

const renderLocalBoundary = (fieldCode, fieldName) => (
  <LocalBoundary>
    {
      localize(Localization.LOCAL_BOUNDARY_TITLE, {
        fieldCode,
        fieldName,
      })
    }
  </LocalBoundary>
)

const isUnique = (field, index, self) => (
  index === self.findIndex((t) => t.code === field.code)
)

const DocumentConsolidatedDataFields = ({
  documentSupplements,
}) => {
  const document = useSelector(documentSelector)
  const documentType = useSelector(documentTypeSelector)
  const activeFieldPk = useSelector(uiSelector)[UiKeys.ACTIVE_FIELD_PK]
  const activeFieldTypes = useSelector(activeFieldTypesSelector)

  const uniqueFields = [...documentType.extraFields, ...documentSupplements].filter(isUnique)

  const getExtractedDataFields = useCallback(() => {
    const edToDisplay = getExtractedDataToDisplay({
      extractedData: document.extractedData,
      documentType,
    })

    return edToDisplay.map((edField) => (
      mapExtractedDataFieldToConsolidatedField({
        edField,
        documentState: document.state,
        documentValidation: document.validation,
        documentType,
        activeFieldPk,
      })
    ))
  }, [
    activeFieldPk,
    document.extractedData,
    document.state,
    document.validation,
    documentType,
  ])

  const getEnrichmentFields = useCallback(() => (
    uniqueFields.map((field) => (
      mapEnrichmentFieldToConsolidatedField({
        field,
        documentState: document.state,
        documentId: document._id,
        documentTypeCode: documentType.code,
        documentSupplements,
        documentTypeExtraFields: documentType.extraFields,
      })
    ))
  ), [
    document.state,
    document._id,
    documentType.code,
    documentType.extraFields,
    documentSupplements,
    uniqueFields,
  ])

  const visibleFields = useMemo(() => {
    const extractedDataFields = getExtractedDataFields()
    const enrichmentFields = getEnrichmentFields()
    const consolidatedFields = [...extractedDataFields, ...enrichmentFields]

    return consolidatedFields.filter((field) => (
      activeFieldTypes.includes(field.type) ||
      activeFieldTypes.includes(field.baseType)
    ))
  }, [
    activeFieldTypes,
    getExtractedDataFields,
    getEnrichmentFields,
  ])

  const renderConsolidatedFields = () => (
    visibleFields
      .sort((a, b) => a.order - b.order)
      .map(({
        name,
        code,
        render,
      }) => (
        <ErrorBoundary
          key={code}
          localBoundary={() => renderLocalBoundary(code, name)}
        >
          {render()}
        </ErrorBoundary>
      ),
      )
  )

  if (!visibleFields.length) {
    return (
      <NoData
        description={localize(Localization.NOTHING_TO_DISPLAY)}
      />
    )
  }

  return (
    <div>
      {renderConsolidatedFields()}
    </div>
  )
}

DocumentConsolidatedDataFields.propTypes = {
  documentSupplements: PropTypes.arrayOf(
    documentSupplementShape,
  ),
}

export {
  DocumentConsolidatedDataFields,
}
