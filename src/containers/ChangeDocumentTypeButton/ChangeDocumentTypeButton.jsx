
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { useFetchDocumentTypesGroupQuery } from '@/apiRTK/documentTypesGroupsApi'
import { localize, Localization } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { previewEntityShape } from '@/models/PreviewEntity'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { StyledSelectOptionModalButton } from './ChangeDocumentTypeButton.styles'

const CHANGE_TYPE = 'changeType'

const ChangeDocumentTypeButton = ({
  children,
  documentType,
  updateDocumentType,
  disabled,
  groupId,
}) => {
  const dispatch = useDispatch()
  const fetching = useSelector(areTypesFetchingSelector)
  const documentTypes = useSelector(documentTypesSelector)
  const { data } = useFetchDocumentTypesGroupQuery(
    { groupId },
    { skip: !groupId },
  )

  useEffect(() => {
    dispatch(fetchDocumentTypes())
  }, [dispatch])

  const groupDocumentTypeIds = data?.group?.documentTypeIds

  const documentTypesForAutocomplete = groupDocumentTypeIds
    ? documentTypes
      .filter((docType) => groupDocumentTypeIds.includes(docType.code))
      .map(DocumentType.toOption)
    : documentTypes.map(DocumentType.toOption)

  const renderTitle = () =>
    documentType
      ? `${localize(Localization.CHANGE_DOCUMENT_TYPE_FROM)} ${documentType.name}`
      : `${localize(Localization.CHANGE_DOCUMENTS_TYPE)}`

  return (
    <StyledSelectOptionModalButton
      key={CHANGE_TYPE}
      disabled={disabled}
      emptySearchText={
        localize(Localization.EMPTY_SEARCH_TEXT, {
          object: `${localize(Localization.TYPE).toLowerCase()}`,
        })
      }
      fetching={fetching}
      onSave={updateDocumentType}
      options={documentTypesForAutocomplete}
      placeholder={localize(Localization.PLACEHOLDER_DOCUMENT_TYPE)}
      saveButtonText={localize(Localization.CONFIRM)}
      title={renderTitle()}
    >
      {children}
    </StyledSelectOptionModalButton>
  )
}

ChangeDocumentTypeButton.propTypes = {
  children: PropTypes.string.isRequired,
  documentType: previewEntityShape,
  updateDocumentType: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  groupId: PropTypes.string,
}

export {
  ChangeDocumentTypeButton,
}
