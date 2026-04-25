
import PropTypes from 'prop-types'
import { useFormContext, useWatch } from 'react-hook-form'
import { LongText } from '@/components/LongText'
import { FIELD_FORM_CODE } from '@/containers/UploadFilesDrawer/constants'
import { StyledTag } from './FileTag.styles'

export const FileTag = ({ file }) => {
  const files = useWatch({ name: FIELD_FORM_CODE.FILES })

  const { setValue } = useFormContext()

  const removeFile = () => {
    const newFiles = files.filter((f) => f.uid !== file.uid)
    setValue(FIELD_FORM_CODE.FILES, newFiles)
  }

  return (
    <StyledTag
      closable
      onClose={removeFile}
    >
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
