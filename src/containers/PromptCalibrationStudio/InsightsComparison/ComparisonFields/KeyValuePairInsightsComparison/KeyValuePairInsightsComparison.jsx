
import PropTypes from 'prop-types'
import { keyValuePairValueShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { useExpandableText } from '@/hooks/useExpandableText'
import {
  KVPWrapper,
  FieldWrapper,
  TextAreaField,
  IconWrapper,
  Wrapper,
  FieldAlias,
} from './KeyValuePairInsightsComparison.styles'

export const KeyValuePairInsightsComparison = ({
  value: keyValuePair,
  alias,
  borderColor,
}) => {
  const {
    ExpandableContainer: KeyExpandableContainer,
    ToggleExpandIcon: KeyToggleExpandIcon,
  } = useExpandableText()

  const {
    ExpandableContainer: ValueExpandableContainer,
    ToggleExpandIcon: ValueToggleExpandIcon,
  } = useExpandableText()

  return (
    <Wrapper>
      {
        alias && (
          <FieldAlias text={alias} />
        )
      }
      <KVPWrapper>
        <FieldWrapper $borderColor={borderColor}>
          <KeyExpandableContainer>
            <TextAreaField>
              {keyValuePair?.key}
            </TextAreaField>
          </KeyExpandableContainer>
          <IconWrapper>
            <KeyToggleExpandIcon />
          </IconWrapper>
        </FieldWrapper>
        <FieldWrapper $borderColor={borderColor}>
          <ValueExpandableContainer>
            <TextAreaField>
              {keyValuePair?.value}
            </TextAreaField>
          </ValueExpandableContainer>
          <IconWrapper>
            <ValueToggleExpandIcon />
          </IconWrapper>
        </FieldWrapper>
      </KVPWrapper>
    </Wrapper>
  )
}

KeyValuePairInsightsComparison.propTypes = {
  value: keyValuePairValueShape,
  borderColor: PropTypes.string.isRequired,
  alias: PropTypes.string,
}
