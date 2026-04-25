
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { RadioGroup } from '@/components/Radio'
import { RadioOption } from '@/components/Radio/RadioOption'
import { FILE_EXTENSION_TO_DOWNLOAD_FORMAT, FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import {
  Label,
  RadioGroupWrapper,
} from './OutputFormat.styles'

const RadioOptions = [
  new RadioOption({
    value: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.XLSX],
    text: localize(Localization.EXCEL),
  }),
  new RadioOption({
    value: FILE_EXTENSION_TO_DOWNLOAD_FORMAT[FileExtension.JSON],
    text: localize(Localization.JSON),
  }),
]

const OutputFormat = ({
  format,
  updateProfile,
}) => {
  const onChange = useCallback((checkedFormat) => {
    updateProfile((profile) => ({
      ...profile,
      format: checkedFormat,
    }))
  }, [updateProfile])

  return (
    <>
      <Label>
        {localize(Localization.OUTPUT_FORMAT)}
      </Label>
      <RadioGroupWrapper>
        <RadioGroup
          onChange={onChange}
          options={RadioOptions}
          value={format}
        />
      </RadioGroupWrapper>
    </>
  )
}

OutputFormat.propTypes = {
  format: PropTypes.oneOf(
    Object.values(FILE_EXTENSION_TO_DOWNLOAD_FORMAT),
  ),
  updateProfile: PropTypes.func.isRequired,
}

export {
  OutputFormat,
}
