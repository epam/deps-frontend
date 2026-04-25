
import PropTypes from 'prop-types'
import { useFormContext, useWatch } from 'react-hook-form'
import { WarningTriangleIcon } from '@/components/Icons/WarningTriangleIcon'
import { LongText } from '@/components/LongText'
import { Tooltip } from '@/components/Tooltip'
import { FIELD_FORM_CODE } from '@/containers/UploadSplittingFilesDrawer/constants'
import { FileExtension } from '@/enums/FileExtension'
import { localize, Localization } from '@/localization/i18n'
import { getFileExtension } from '@/utils/getFileExtension'
import { StyledTag } from './FileTag.styles'

export const FileTag = ({ file }) => {
  const files = useWatch({ name: FIELD_FORM_CODE.FILES })

  const { setValue } = useFormContext()

  const removeFile = () => {
    const newFiles = files.filter((f) => f.uid !== file.uid)
    setValue(FIELD_FORM_CODE.FILES, newFiles)
  }

  const showWarningIcon = getFileExtension(file.name) !== FileExtension.PDF

  return (
    <StyledTag
      closable
      onClose={removeFile}
    >
      {
        showWarningIcon && (
          <Tooltip title={localize(Localization.SPLITTING_IS_APPLICABLE_FOR_PDF)}>
            <WarningTriangleIcon />
          </Tooltip>
        )
      }
      <LongText text={file.name} />
    </StyledTag>
  )
}

FileTag.propTypes = {
  file: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(File),
  ]).isRequired,
}
