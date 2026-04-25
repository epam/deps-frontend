
import { SelectOption } from '@/components/Select'
import { TableFilterIndicator } from '@/components/Table/TableFilterIndicator'
import { TableSelectFilter } from '@/components/Table/TableSelectFilter'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { FieldColumn } from '../FieldColumn'
import { ValidationRulesCell } from '../ValidationRulesCell'

const sortValidationRules = (rulesA, rulesB) => rulesA.length - rulesB.length

const getOptions = ({
  validators = [],
  crossFieldValidators = [],
}) => {
  const crossFieldRulesNames = crossFieldValidators.map((rule) => rule.name)
  const rulesNames = validators.flatMap(({ rules }) => rules.map((rule) => rule.name))

  const uniqueNames = [...new Set(
    [
      ...crossFieldRulesNames,
      ...rulesNames,
    ],
  )]

  return uniqueNames
    .sort(stringsSorter)
    .map((rule) => new SelectOption(rule, rule))
}

const generateFieldValidationRulesColumn = (documentType) => {
  const options = getOptions(documentType)

  return ({
    title: localize(Localization.BUSINESS_RULES),
    render: (_, { code, validationRules }) => !!validationRules.length && (
      <ValidationRulesCell
        extraFields={documentType.extraFields}
        extractionFields={documentType.fields}
        fieldCode={code}
        validationRules={validationRules}
      />
    ),
    filterDropdown: (props) => {
      return (
        <TableSelectFilter
          options={options}
          {...props}
        />
      )
    },
    filterIcon: (filtered) => (
      <TableFilterIndicator
        active={filtered}
      />
    ),
    onFilter: (value, record) => {
      const ruleNames = record[FieldColumn.VALIDATION_RULES].map((rule) => rule.name)
      return ruleNames.includes(value)
    },
    sorter: (a, b) => sortValidationRules(a.validationRules, b.validationRules),
  })
}

export {
  generateFieldValidationRulesColumn,
}
