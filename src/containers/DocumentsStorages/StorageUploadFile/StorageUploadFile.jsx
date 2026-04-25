
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { ButtonType } from '@/components/Button'
import { BanIcon } from '@/components/Icons/BanIcon'
import { CheckIcon } from '@/components/Icons/CheckIcon'
import { FileDOCXIcon } from '@/components/Icons/FileDOCXIcon'
import { FileImageIcon } from '@/components/Icons/FileImageIcon'
import { FileJPGIcon } from '@/components/Icons/FileJPGIcon'
import { FilePDFIcon } from '@/components/Icons/FilePDFIcon'
import { FileXLSXIcon } from '@/components/Icons/FileXLSXIcon'
import { LoadingIcon } from '@/components/Icons/LoadingIcon'
import { ListContent } from '@/containers/DocumentFileUpload/DocumentFileUploadItem.styles'
import { ComponentSize } from '@/enums/ComponentSize'
import { MimeType } from '@/enums/MimeType'
import { UploadStatus } from '@/enums/UploadStatus'
import { Localization, localize } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { getFileSizeStr } from '@/utils/file'
import { storageFileShape } from '../models/StorageFile'
import {
  ListItem,
  ListMeta,
  FileIcon,
  Button,
  Avatar,
} from './StorageUploadFile.styles'

const REMOVE_BTN_KEY = 'remove'

const getItemSizeText = (size) => (
  localize(Localization.FILE_SIZE, { size: getFileSizeStr(size) })
)

const setIconStyles = (icon) => (
  <FileIcon>
    {icon}
  </FileIcon>
)

const renderIcon = (mimeType) => (
  <Avatar size={ComponentSize.LARGE}>
    {
      MIME_TO_ICON[mimeType] ||
      setIconStyles(<FileImageIcon />)
    }
  </Avatar>
)

const renderTitle = (name) => (
  <span title={name}>{name}</span>
)

const MIME_TO_ICON = {
  [MimeType.IMAGE_JPEG]: setIconStyles(<FileJPGIcon />),
  [MimeType.APPLICATION_PDF]: setIconStyles(<FilePDFIcon />),
  [MimeType.APPLICATION_DOCX]: setIconStyles(<FileDOCXIcon />),
  [MimeType.APPLICATION_MICROSOFT_EXCEL_OPEN_XML]: setIconStyles(<FileXLSXIcon />),
  [MimeType.APPLICATION_XLS]: setIconStyles(<FileXLSXIcon />),
  [MimeType.APPLICATION_GOOGLE_DOCUMENT]: setIconStyles(<FileDOCXIcon />),
  [MimeType.APPLICATION_GOOGLE_SPREADSHEET]: setIconStyles(<FileXLSXIcon />),
}

const UPLOAD_STATUS_TO_COMPONENT = {
  [UploadStatus.PENDING]: <LoadingIcon />,
  [UploadStatus.SUCCESS]: <CheckIcon color={theme.color.success} />,
  [UploadStatus.FAILURE]: <BanIcon color={theme.color.errorDark} />,
}

const StorageUploadFile = ({
  file,
  removeFile,
  uploadStatus,
}) => {
  const { id, name, mimeType, sizeBytes } = file

  const onRemoveClick = useCallback(() => (
    removeFile(id)
  ), [id, removeFile])

  const fileActions = useMemo(() => ([
    <Button
      key={REMOVE_BTN_KEY}
      onClick={onRemoveClick}
      type={ButtonType.TEXT}
    >
      {localize(Localization.REMOVE)}
    </Button>,
  ]), [onRemoveClick])

  return (
    <ListItem actions={!uploadStatus && fileActions}>
      <ListMeta
        avatar={renderIcon(mimeType)}
        description={getItemSizeText(sizeBytes)}
        title={renderTitle(name)}
      />
      <ListContent>
        {UPLOAD_STATUS_TO_COMPONENT[uploadStatus]}
      </ListContent>
    </ListItem>
  )
}

StorageUploadFile.propTypes = {
  file: PropTypes.oneOfType([
    storageFileShape,
  ]).isRequired,
  removeFile: PropTypes.func.isRequired,
  uploadStatus: PropTypes.oneOf(
    Object.values(UploadStatus),
  ),
}

export {
  StorageUploadFile,
}
