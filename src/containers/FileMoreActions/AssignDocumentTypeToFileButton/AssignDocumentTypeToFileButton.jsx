
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { useFetchDocumentTypesGroupQuery } from '@/apiRTK/documentTypesGroupsApi'
import { useCreateDocumentFromFileMutation } from '@/apiRTK/filesApi'
import { Tooltip } from '@/components/Tooltip'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { fileShape } from '@/models/File'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { StyledSelectOptionModalButton } from './AssignDocumentTypeToFileButton.styles'

const ASSIGN_DOCUMENT_TYPE = 'assignDocumentType'

const AssignDocumentTypeToFileButton = ({
  children,
  file,
}) => {
  const dispatch = useDispatch()
  const fetching = useSelector(areTypesFetchingSelector)
  const documentTypes = useSelector(documentTypesSelector)
  const hasReference = !!file.reference

  const [createDocumentFromFile, { isLoading }] = useCreateDocumentFromFileMutation()

  const groupId = file.processingParams?.groupId

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

  const createDocument = useCallback(async (documentTypeId) => {
    try {
      await createDocumentFromFile({
        fileId: file.id,
        documentTypeId,
      }).unwrap()
      notifySuccess(localize(Localization.ASSIGN_DOCUMENT_TYPE_SUCCESSFUL))
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.ASSIGN_DOCUMENT_TYPE_FAILED)
      notifyWarning(message)
    }
  }, [createDocumentFromFile, file.id])

  const renderTitle = () => localize(Localization.ASSIGN_DOCUMENT_TYPE_TO_FILE)

  const button = (
    <StyledSelectOptionModalButton
      key={ASSIGN_DOCUMENT_TYPE}
      disabled={hasReference}
      emptySearchText={
        localize(Localization.EMPTY_SEARCH_TEXT, {
          object: `${localize(Localization.TYPE).toLowerCase()}`,
        })
      }
      fetching={fetching || isLoading}
      onSave={createDocument}
      options={documentTypesForAutocomplete}
      placeholder={localize(Localization.PLACEHOLDER_DOCUMENT_TYPE)}
      saveButtonText={localize(Localization.CONFIRM)}
      title={renderTitle()}
    >
      {children}
    </StyledSelectOptionModalButton>
  )

  if (hasReference) {
    return (
      <Tooltip title={localize(Localization.FILE_ACTION_UNAVAILABLE_REFERENCE_TOOLTIP)}>
        {button}
      </Tooltip>
    )
  }

  return button
}

AssignDocumentTypeToFileButton.propTypes = {
  children: PropTypes.string.isRequired,
  file: fileShape.isRequired,
}

export {
  AssignDocumentTypeToFileButton,
}
