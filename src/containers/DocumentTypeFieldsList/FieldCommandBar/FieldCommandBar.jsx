
import PropTypes from 'prop-types'
import { memo, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { fetchDocumentType } from '@/actions/documentType'
import { DeleteExtractionFieldModalButton } from '@/containers/DeleteExtractionFieldModalButton'
import { DeleteExtraFieldModalButton } from '@/containers/DeleteExtraFieldModalButton'
import { EditExtractionFieldDrawerButton } from '@/containers/EditExtractionFieldDrawerButton'
import { EditExtraFieldDrawerButton } from '@/containers/EditExtraFieldDrawerButton'
import { EditGenAIDrivenFieldModalButton } from '@/containers/EditGenAIDrivenFieldModalButton'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { CommandBar } from './FieldCommandBar.styles'

const FIELD_CATEGORY_TO_EDIT_COMPONENT = {
  [DocumentTypeFieldCategory.EXTRACTION]: EditExtractionFieldDrawerButton,
  [DocumentTypeFieldCategory.EXTRA]: EditExtraFieldDrawerButton,
  [DocumentTypeFieldCategory.GEN_AI]: EditGenAIDrivenFieldModalButton,
}

const FIELD_CATEGORY_TO_DELETE_COMPONENT = {
  [DocumentTypeFieldCategory.EXTRACTION]: DeleteExtractionFieldModalButton,
  [DocumentTypeFieldCategory.EXTRA]: DeleteExtraFieldModalButton,
  [DocumentTypeFieldCategory.GEN_AI]: DeleteExtractionFieldModalButton,
}

const FieldCommandBar = memo(({
  documentTypeCode,
  field,
  category,
}) => {
  const dispatch = useDispatch()

  const EditFieldComponent = FIELD_CATEGORY_TO_EDIT_COMPONENT[category]
  const DeleteFieldComponent = FIELD_CATEGORY_TO_DELETE_COMPONENT[category]

  const refreshData = useCallback((extras) => {
    dispatch(fetchDocumentType(documentTypeCode, extras))
  }, [
    documentTypeCode,
    dispatch,
  ])

  const refreshDataByCategory = useMemo(() => ({
    [DocumentTypeFieldCategory.EXTRACTION]: () => refreshData([DocumentTypeExtras.EXTRACTION_FIELDS]),
    [DocumentTypeFieldCategory.EXTRA]: () => refreshData([DocumentTypeExtras.EXTRA_FIELDS]),
    [DocumentTypeFieldCategory.GEN_AI]: () => refreshData([
      DocumentTypeExtras.EXTRACTION_FIELDS,
      DocumentTypeExtras.LLM_EXTRACTORS,
    ]),
  }), [refreshData])

  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <EditFieldComponent
          documentTypeCode={documentTypeCode}
          field={field}
          onAfterEditing={refreshDataByCategory[category]}
        />
      ),
    },
    {
      renderComponent: () => (
        <DeleteFieldComponent
          documentTypeCode={documentTypeCode}
          field={field}
          onAfterDelete={refreshDataByCategory[category]}
        />
      ),
    },
  ], [
    documentTypeCode,
    category,
    field,
    refreshDataByCategory,
  ])

  return (
    <CommandBar commands={commands} />
  )
})

FieldCommandBar.propTypes = {
  documentTypeCode: PropTypes.string.isRequired,
  field: PropTypes.oneOfType([
    documentTypeFieldShape,
    documentTypeExtraFieldShape,
  ]).isRequired,
  category: PropTypes.oneOf(
    Object.values(DocumentTypeFieldCategory),
  ).isRequired,
}

export {
  FieldCommandBar,
}
