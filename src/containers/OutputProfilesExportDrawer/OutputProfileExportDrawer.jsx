
import PropTypes from 'prop-types'
import {
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react'
import { createProfileOutput } from '@/api/outputProfilesApi'
import { ButtonType } from '@/components/Button'
import { NoData } from '@/components/NoData'
import { Placement } from '@/enums/Placement'
import { useDownload } from '@/hooks/useDownload'
import { localize, Localization } from '@/localization/i18n'
import { extendedDocumentTypeShape } from '@/models/ExtendedDocumentType'
import { ExportingType } from '@/models/OutputProfile'
import { apiMap } from '@/utils/apiMap'
import { getDownloadFileName, removeFileExtension } from '@/utils/file'
import { getFileExtension } from '@/utils/getFileExtension'
import { notifyWarning } from '@/utils/notification'
import {
  DrawerFooterWrapper,
  DrawerHeaderWrapper,
  CancelButton,
  DownloadButton,
  Drawer,
} from './OutputProfileExportDrawer.styles'
import { ProfilesTabs } from './ProfilesTabs'

const DRAWER_WIDTH = '60%'

const TEST_ID = {
  CANCEL_BUTTON: 'cancel-button',
  DOWNLOAD_BUTTON: 'download-button',
}

const getOutputFileName = (documentTitle, profileName) => {
  const adjustedTitle = removeFileExtension(documentTitle)
  return `${adjustedTitle}(${profileName})`
}

const OutputProfileExportDrawer = ({
  documentId,
  documentTitle,
  documentType,
  isVisible,
  onClose,
}) => {
  const [activeProfile, setActiveProfile] = useState(() => documentType?.profiles.find((p) => p.exportingType === ExportingType.BUILT_IN))
  const [isDownloading, setIsDownloading] = useState(false)
  const { downloadOutput } = useDownload()

  useEffect(() => {
    setActiveProfile(documentType?.profiles.find((p) => p.exportingType === ExportingType.BUILT_IN))
  }, [
    documentType,
    setActiveProfile,
  ])

  const getContainer = useCallback(() => document.body, [])

  const downloadProfile = useCallback(async () => {
    try {
      setIsDownloading(true)

      const { filePath } = await createProfileOutput({
        documentId,
        documentTypeId: documentType?.code,
        profileId: activeProfile.id,
      })

      const fileName = getDownloadFileName({
        extension: getFileExtension(filePath),
        title: getOutputFileName(documentTitle, activeProfile.name),
      })

      await downloadOutput(apiMap.fileStorage.v1.file.output(filePath), fileName)
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsDownloading(false)
    }
  }, [
    activeProfile,
    documentId,
    documentTitle,
    documentType?.code,
    downloadOutput,
  ])

  const DrawerTitle = useMemo(() => (
    <DrawerHeaderWrapper>
      {localize(Localization.EXPORT)}
    </DrawerHeaderWrapper>
  ), [])

  const DrawerFooter = useMemo(() => {
    const disabled = isDownloading || !documentType?.profiles.length

    return (
      <DrawerFooterWrapper>
        <CancelButton
          data-testid={TEST_ID.CANCEL_BUTTON}
          disabled={disabled}
          onClick={onClose}
        >
          {localize(Localization.CANCEL)}
        </CancelButton>
        <DownloadButton
          data-testid={TEST_ID.DOWNLOAD_BUTTON}
          disabled={disabled}
          loading={isDownloading}
          onClick={downloadProfile}
          type={ButtonType.PRIMARY}
        >
          {localize(Localization.DOWNLOAD)}
        </DownloadButton>
      </DrawerFooterWrapper>
    )
  }, [
    downloadProfile,
    isDownloading,
    documentType?.profiles.length,
    onClose,
  ])

  const profiles = useMemo(() => (
    documentType?.profiles.filter((p) => p.exportingType === ExportingType.BUILT_IN)
  ), [documentType?.profiles])

  const ProfilesContent = useMemo(() => {
    if (!profiles?.length) {
      return (
        <NoData />
      )
    }

    return (
      <ProfilesTabs
        activeProfile={activeProfile}
        fields={documentType?.fields || []}
        profiles={profiles || []}
        setActiveProfile={setActiveProfile}
      />
    )
  }, [
    activeProfile,
    documentType?.fields,
    profiles,
    setActiveProfile,
  ])

  return (
    <Drawer
      closeIcon={false}
      destroyOnClose
      footer={DrawerFooter}
      getContainer={getContainer}
      maskClosable={!isDownloading}
      onClose={onClose}
      open={isVisible}
      placement={Placement.RIGHT}
      title={DrawerTitle}
      width={DRAWER_WIDTH}
    >
      {ProfilesContent}
    </Drawer>
  )
}

OutputProfileExportDrawer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  documentId: PropTypes.string,
  documentTitle: PropTypes.string,
  documentType: extendedDocumentTypeShape,
}

export {
  OutputProfileExportDrawer,
}
