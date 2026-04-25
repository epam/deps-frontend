
import PropTypes from 'prop-types'
import { useExpandableText } from '@/hooks/useExpandableText'
import {
  Wrapper,
  TextAreaField,
  IconWrapper,
  FieldAlias,
  ContentWrapper,
} from './StringInsightsComparison.styles'

export const StringInsightsComparison = ({
  value,
  alias,
  borderColor,
}) => {
  const {
    ExpandableContainer,
    ToggleExpandIcon,
  } = useExpandableText()

  return (
    <Wrapper>
      {
        alias && (
          <FieldAlias text={alias} />
        )
      }
      <ContentWrapper $borderColor={borderColor}>
        <ExpandableContainer>
          <TextAreaField>
            {value}
          </TextAreaField>
        </ExpandableContainer>
        <IconWrapper>
          <ToggleExpandIcon />
        </IconWrapper>
      </ContentWrapper>
    </Wrapper>
  )
}

StringInsightsComparison.propTypes = {
  value: PropTypes.string,
  alias: PropTypes.string,
  borderColor: PropTypes.string.isRequired,
}
