
import PropTypes from 'prop-types'
import {
  useMemo,
  useCallback,
} from 'react'
import { useSelector } from 'react-redux'
import { DocumentTypeFilterKey, EXTRACTION_TYPE_FILTER_KEY } from '@/constants/navigation'
import { DocumentTypesListView } from '@/containers/DocumentTypesListView'
import { documentTypeShape } from '@/models/DocumentType'
import { filterSelector } from '@/selectors/navigation'

const DocumentTypes = ({
  documentTypes,
  documentTypesExtractor,
}) => {
  const filters = useSelector(filterSelector)

  const filterByName = useCallback((type) => (
    !filters[DocumentTypeFilterKey.NAME] ||
    type.name?.toLowerCase().includes(filters[DocumentTypeFilterKey.NAME]?.toLowerCase())
  ), [filters])

  const filterByEngine = useCallback((type) => (
    !filters[DocumentTypeFilterKey.ENGINE] ||
    filters[DocumentTypeFilterKey.ENGINE]?.includes(type.engine)
  ), [filters])

  const filterByLanguage = useCallback((type) => (
    !filters[DocumentTypeFilterKey.LANGUAGE] ||
    filters[DocumentTypeFilterKey.LANGUAGE]?.includes(type.language)
  ), [filters])

  const filterByDateRange = useCallback((type) => (
    !filters[DocumentTypeFilterKey.DATE_RANGE] ||
    (
      type?.createdAt >= filters[DocumentTypeFilterKey.DATE_RANGE][0].toString() &&
      type?.createdAt <= filters[DocumentTypeFilterKey.DATE_RANGE][1].toString()
    )
  ), [filters])

  const filteredDocumentTypesList = useMemo(() => documentTypes
    .filter(filterByName)
    .filter(filterByEngine)
    .filter(filterByLanguage)
    .filter(filterByDateRange)
  , [
    documentTypes,
    filterByName,
    filterByEngine,
    filterByLanguage,
    filterByDateRange,
  ])

  return (
    <DocumentTypesListView
      documentTypes={filteredDocumentTypesList}
      documentTypesExtractor={documentTypesExtractor}
    />
  )
}

DocumentTypes.propTypes = {
  documentTypes: PropTypes.arrayOf(documentTypeShape),
  documentTypesExtractor: PropTypes.oneOf(
    Object.values(EXTRACTION_TYPE_FILTER_KEY),
  ).isRequired,
}

export {
  DocumentTypes,
}
