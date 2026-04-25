
import PropTypes from 'prop-types'
import { Localization, localize } from '@/localization/i18n'
import {
  FieldLabel,
  Input,
  Wrapper,
} from './ExtraFieldName.styles'

const INPUT_MAX_LENGTH = 100

const ExtraFieldName = ({
  name,
  updateField,
}) => {
  const onInputChange = (e) => {
    const normalizedValue = e.target.value.trimStart()

    updateField((prevField) => ({
      ...prevField,
      name: normalizedValue,
    }))
  }

  return (
    <Wrapper>
      <FieldLabel
        name={localize(Localization.NAME)}
        required
      />
      <Input
        maxLength={INPUT_MAX_LENGTH}
        onChange={onInputChange}
        placeholder={localize(Localization.NAME_PLACEHOLDER)}
        value={name}
      />
    </Wrapper>
  )
}

ExtraFieldName.propTypes = {
  name: PropTypes.string.isRequired,
  updateField: PropTypes.func.isRequired,
}

export {
  ExtraFieldName,
}
