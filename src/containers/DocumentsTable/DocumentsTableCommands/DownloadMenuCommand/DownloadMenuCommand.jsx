
import PropTypes from 'prop-types'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { fetchDocumentType } from '@/api/documentTypesApi'
import { ButtonType } from '@/components/Button'
import { ArrowDownWideIcon } from '@/components/Icons/ArrowDownWideIcon'
import { ExportDocumentIcon } from '@/components/Icons/ExportDocumentIcon'
import { DownloadMenu } from '@/containers/DownloadMenu'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { Localization, localize } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { notifyWarning } from '@/utils/notification'
import { StyledDropdownButton, RotatableIconWrapper } from './DownloadMenuCommand.styles'

export const DownloadMenuCommand = ({
  checkedDocuments,
  documents,
}) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [documentType, setDocumentType] = useState(null)
  const [isDocumentTypeFetching, setIsDocumentTypeFetching] = useState(false)

  const getPopupContainer = (trigger) =>
    trigger.parentNode.parentNode.parentNode.parentNode

  const singleSelectedDocument = useMemo(() => {
    if (checkedDocuments.length !== 1) {
      return {}
    }

    return documents.find((d) => d._id === checkedDocuments[0]) || {}
  }, [checkedDocuments, documents])

  const singleSelectedDocumentData = useMemo(() => ({
    documentId: singleSelectedDocument._id,
    documentType,
    documentTitle: singleSelectedDocument.title,
    files: singleSelectedDocument.files,
    state: singleSelectedDocument.state,
    error: singleSelectedDocument.error,
    containerType: singleSelectedDocument.containerType,
  }),
  [
    singleSelectedDocument,
    documentType,
  ],
  )

  useEffect(() => {
    if (!singleSelectedDocument.documentType?.code) {
      setDocumentType(null)
      return
    }

    if (singleSelectedDocument.documentType?.code === UNKNOWN_DOCUMENT_TYPE.code) {
      setDocumentType(UNKNOWN_DOCUMENT_TYPE)
      return
    }

    if (!isMenuOpened || documentType) return

    const loadDocumentType = async () => {
      try {
        setIsDocumentTypeFetching(true)

        const documentType = await fetchDocumentType(
          singleSelectedDocument.documentType?.code,
          [
            DocumentTypeExtras.EXTRACTION_FIELDS,
            DocumentTypeExtras.PROFILES,
          ],
        )

        setDocumentType(documentType)
      } catch {
        notifyWarning(localize(Localization.DEFAULT_ERROR))
      } finally {
        setIsDocumentTypeFetching(false)
      }
    }

    loadDocumentType()
  },
  [
    documentType,
    isMenuOpened,
    singleSelectedDocument,
  ])

  return (
    <DownloadMenu
      disabled={checkedDocuments.length !== 1}
      getPopupContainer={getPopupContainer}
      isDocumentTypeFetching={isDocumentTypeFetching}
      {...singleSelectedDocumentData}
    >
      <StyledDropdownButton
        onClick={() => setIsMenuOpened((prev) => !prev)}
        type={ButtonType.PRIMARY}
      >
        <ExportDocumentIcon />
        {localize(Localization.EXPORT)}
        <RotatableIconWrapper $isRotated={isMenuOpened}>
          <ArrowDownWideIcon />
        </RotatableIconWrapper>
      </StyledDropdownButton>
    </DownloadMenu>
  )
}

DownloadMenuCommand.propTypes = {
  documents: PropTypes.arrayOf(documentShape).isRequired,
  checkedDocuments: PropTypes.arrayOf(PropTypes.string).isRequired,
}
