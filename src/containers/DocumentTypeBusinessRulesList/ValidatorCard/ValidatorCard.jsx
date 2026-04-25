
import PropTypes from 'prop-types'
import { LongTagsList } from '@/containers/LongTagsList'
import { RESOURCE_VALIDATION_RULE_SEVERITY, ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { tagShape } from '@/models/Tag'
import { ValidatorCardActions } from '../ValidatorCardActions'
import {
  CardWrapper,
  FieldsList,
  Header,
  HeaderLeftSection,
  HeaderRightSection,
  IssueMessage,
  RuleName,
  Severity,
  VerticalLine,
} from './ValidatorCard.styles'

const ValidatorCard = ({
  fieldsTags,
  message,
  name,
  severity,
  validatorId,
  validatorCategory,
}) => (
  <CardWrapper>
    <Header>
      <HeaderLeftSection>
        <RuleName text={name} />
        <IssueMessage text={message} />
      </HeaderLeftSection>
      <HeaderRightSection>
        <Severity>
          {RESOURCE_VALIDATION_RULE_SEVERITY[severity || ValidationRuleSeverity.ERROR]}
        </Severity>
        <VerticalLine />
        <ValidatorCardActions
          fieldNames={fieldsTags.map((tag) => tag.text)}
          name={name}
          validatorCategory={validatorCategory}
          validatorId={validatorId}
        />
      </HeaderRightSection>
    </Header>
    <FieldsList>
      <LongTagsList tags={fieldsTags} />
    </FieldsList>
  </CardWrapper>
)

ValidatorCard.propTypes = {
  fieldsTags: PropTypes.arrayOf(tagShape).isRequired,
  message: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  severity: PropTypes.string.isRequired,
  validatorId: PropTypes.string.isRequired,
  validatorCategory: PropTypes.oneOf(Object.values(ValidatorCategory)).isRequired,
}

export {
  ValidatorCard,
}
