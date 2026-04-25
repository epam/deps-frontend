
import PropTypes from 'prop-types'
import {
  FieldLabel,
  InfoWrapper,
  TextAreaField,
  TextAreaIconsWrapper as IconWrapper,
} from '@/containers/DocumentField'
import { useExpandableText } from '@/hooks/useExpandableText'
import { Localization, localize } from '@/localization/i18n'
import {
  FieldInputWrapper,
  Element,
} from '../GenAiField.styles'

const ROWS_TO_COLLAPSE = 2

const KeyField = ({ value, updateField }) => {
  const { ExpandableContainer, ToggleExpandIcon } = useExpandableText(ROWS_TO_COLLAPSE)

  return (
    <Element>
      <InfoWrapper>
        <FieldLabel
          name={localize(Localization.KEY)}
        />
      </InfoWrapper>
      <FieldInputWrapper>
        <ExpandableContainer>
          <TextAreaField
            onChange={updateField}
            value={value}
          />
        </ExpandableContainer>
        <IconWrapper>
          <ToggleExpandIcon />
        </IconWrapper>
      </FieldInputWrapper>
    </Element>
  )
}

KeyField.propTypes = {
  value: PropTypes.string,
  updateField: PropTypes.func.isRequired,
}

export { KeyField }
