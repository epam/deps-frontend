
import PropTypes from 'prop-types'
import { Input } from '@/components/Input'
import { InputNumber } from '@/components/InputNumber'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { maskExcessChars } from '@/utils/string'
import { ExampleWrapper, FieldLabel } from './DisplayCharLimitField.styles'

const EXAMPLE_TEXT_VALUE = localize(Localization.MASKING_TEXT_EXAMPLE)
const EXAMPLE_DATE_VALUE = localize(Localization.MASKING_DATE_EXAMPLE)

const MIN_CHAR_LIMIT = 0

const DisplayCharLimitField = ({
  fieldType,
  charLimit,
  ...restProps
}) => {
  const exampleValue = (
    fieldType === FieldType.DATE
      ? EXAMPLE_DATE_VALUE
      : EXAMPLE_TEXT_VALUE
  )

  return (
    <>
      <InputNumber
        {...restProps}
        min={MIN_CHAR_LIMIT}
        value={charLimit}
      />
      <ExampleWrapper>
        <FieldLabel name={localize(Localization.FIELD_EXAMPLE)} />
        <Input
          value={maskExcessChars(charLimit, exampleValue)}
        />
      </ExampleWrapper>
    </>
  )
}

DisplayCharLimitField.propTypes = {
  charLimit: PropTypes.number,
  fieldType: PropTypes.oneOf(Object.values(FieldType)),
}

export {
  DisplayCharLimitField,
}
