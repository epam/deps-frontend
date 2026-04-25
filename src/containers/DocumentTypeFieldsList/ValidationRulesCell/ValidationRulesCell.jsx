
import PropTypes from 'prop-types'
import {
  memo,
  useCallback,
  useMemo,
} from 'react'
import { Dropdown } from '@/components/Dropdown'
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
import { LongText } from '@/components/LongText'
import { useDeleteValidationRuleAction } from '@/containers/DeleteValidationRuleButton'
import { LongTagsList } from '@/containers/LongTagsList'
import { RESOURCE_VALIDATION_RULE_SEVERITY } from '@/enums/ValidationRuleSeverity'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { CrossFieldValidator, crossFieldValidatorShape } from '@/models/CrossFieldValidator'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { Tag } from '@/models/Tag'
import { validatorRuleShape } from '@/models/Validator'
import {
  Details,
  Fields,
  Message,
  StyledTag,
  TagText,
  Title,
  Severity,
  Wrapper,
} from './ValidationRulesCell.styles'

const ValidationRulesCell = memo(({
  extraFields = [],
  extractionFields = [],
  fieldCode,
  validationRules,
}) => {
  const { confirmAndDeleteValidationRule } = useDeleteValidationRuleAction()

  const fieldsList = useMemo(() => [
    ...extraFields,
    ...extractionFields,
  ], [extraFields, extractionFields])

  const codeToNameMap = Object.fromEntries(fieldsList.map((field) => [field.code, field.name]))

  const mappedRules = useMemo(() => validationRules.map((rule) => {
    const isCrossFieldRule = !!rule.id

    const message = isCrossFieldRule
      ? CrossFieldValidator.replaceFieldCodesInMessage(rule.issueMessage?.message, fieldsList)
      : rule.issueMessage

    const validatedFieldCodes = isCrossFieldRule ? rule.validatedFields : [fieldCode]
    const validatedFields = validatedFieldCodes.map((code) => codeToNameMap[code] || code)

    return ({
      ...rule,
      message,
      ruleId: rule.id || `${fieldCode}-${rule.name}`,
      validatorCategory: isCrossFieldRule ? ValidatorCategory.CROSS_FIELD_VALIDATOR : ValidatorCategory.VALIDATOR,
      validatedFields,
    })
  }), [
    codeToNameMap,
    fieldCode,
    fieldsList,
    validationRules,
  ])

  const rulesById = useMemo(() =>
    Object.fromEntries(mappedRules.map((r) => [r.ruleId, r])),
  [mappedRules],
  )

  const tags = useMemo(() => mappedRules.map((rule) =>
    new Tag({
      id: rule.ruleId,
      text: rule.name,
    }),
  ), [mappedRules])

  const renderFieldNames = useCallback((validatedFields) => validatedFields.map((fieldName) => (
    <StyledTag
      key={fieldName}
      closable={false}
    >
      <LongText text={fieldName} />
    </StyledTag>
  )), [])

  const renderTagContent = useCallback((tag) => {
    const rule = rulesById[tag.id]

    if (!rule) {
      return
    }

    const renderContent = () => (
      <Wrapper>
        <Details>
          <Title>{rule.name}</Title>
          <Severity>{RESOURCE_VALIDATION_RULE_SEVERITY[rule.severity]}</Severity>
          <Message>{rule.message}</Message>
        </Details>
        <Fields>
          {renderFieldNames(rule.validatedFields)}
        </Fields>
      </Wrapper>
    )

    return (
      <Dropdown
        destroyPopupOnHide
        dropdownRender={renderContent}
      >
        <TagText>
          {rule.name}
        </TagText>
      </Dropdown>
    )
  }, [
    renderFieldNames,
    rulesById,
  ])

  const deleteRule = useCallback((tag) => {
    const rule = mappedRules.find((r) => r.ruleId === tag.id)

    confirmAndDeleteValidationRule({
      fieldNames: rule.validatedFields,
      ruleName: rule.name,
      validatorCategory: rule.validatorCategory,
      validatorId: rule.id || fieldCode,
    })
  }, [
    confirmAndDeleteValidationRule,
    fieldCode,
    mappedRules,
  ])

  return (
    <LongTagsList
      icon={<LayerGroupIcon />}
      isTagClosable={true}
      onTagClose={deleteRule}
      renderVisibleTagContent={renderTagContent}
      tags={tags}
    />
  )
})

ValidationRulesCell.propTypes = {
  fieldCode: PropTypes.string.isRequired,
  extraFields: PropTypes.arrayOf(documentTypeExtraFieldShape),
  extractionFields: PropTypes.arrayOf(documentTypeFieldShape),
  validationRules: PropTypes.arrayOf(
    PropTypes.oneOfType([
      crossFieldValidatorShape,
      validatorRuleShape,
    ]),
  ).isRequired,
}

export {
  ValidationRulesCell,
}
