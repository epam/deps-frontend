
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Spin } from '@/components/Spin'
import { AddBusinessRule } from '@/containers/AddBusinessRule'
import { EmptyState } from '@/containers/EmptyState'
import { InfoPanel } from '@/containers/InfoPanel'
import { ValidatorCategory } from '@/enums/ValidatorCategory'
import { Localization, localize } from '@/localization/i18n'
import { CrossFieldValidator } from '@/models/CrossFieldValidator'
import { Tag } from '@/models/Tag'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { isDocumentTypeFetchingSelector } from '@/selectors/requests'
import {
  CardsWrapper,
  Wrapper,
} from './DocumentTypeBusinessRulesList.styles'
import { ValidatorCard } from './ValidatorCard'

const buildTags = (codes = [], codeToNameMap = {}) => (
  codes.map((code) => new Tag({
    id: code,
    text: codeToNameMap[code] ?? code,
  }))
)

const DocumentTypeBusinessRulesList = () => {
  const documentType = useSelector(documentTypeStateSelector)
  const isLoading = useSelector(isDocumentTypeFetchingSelector)

  const {
    crossFieldValidators = [],
    validators = [],
    fields = [],
  } = documentType

  const codeToName = Object.fromEntries(fields.map((f) => [f.code, f.name]))

  const crossFieldValidatorCards = useMemo(() => crossFieldValidators.map((v) => ({
    id: v.id,
    name: v.name,
    message: CrossFieldValidator.replaceFieldCodesInMessage(v.issueMessage?.message, fields),
    severity: v.severity,
    fields: v.validatedFields,
    validatorId: v.id,
    validatorCategory: ValidatorCategory.CROSS_FIELD_VALIDATOR,
  })), [crossFieldValidators, fields])

  const singleFieldValidatorCards = useMemo(() => validators
    .flatMap((validator) =>
      validator.rules.map((rule) => ({
        id: `${validator.code}-${rule.name}`,
        name: rule.name,
        message: rule.issueMessage,
        severity: rule.severity,
        fields: [validator.code],
        validatorId: validator.code,
        validatorCategory: ValidatorCategory.VALIDATOR,
      })),
    ), [validators])

  const validatorList = useMemo(() => ([
    ...crossFieldValidatorCards,
    ...singleFieldValidatorCards,
  ]), [
    singleFieldValidatorCards,
    crossFieldValidatorCards,
  ])

  const total = validatorList.length

  if (isLoading) {
    return <Spin.Centered spinning />
  }

  return (
    <Wrapper>
      <InfoPanel
        fetching={isLoading}
        renderActions={() => <AddBusinessRule />}
        total={total}
      />
      {
        total ? (
          <CardsWrapper>
            {
              validatorList.map((c) => (
                <ValidatorCard
                  key={c.id}
                  fieldsTags={buildTags(c.fields, codeToName)}
                  message={c.message}
                  name={c.name}
                  severity={c.severity}
                  validatorCategory={c.validatorCategory}
                  validatorId={c.validatorId}
                />
              ))
            }
          </CardsWrapper>
        ) : (
          <EmptyState title={localize(Localization.BUSINESS_RULES_WERE_NOT_FOUND)} />
        )
      }
    </Wrapper>
  )
}

export {
  DocumentTypeBusinessRulesList,
}
