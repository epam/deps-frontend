
import { RadioOption } from '@/components/Radio/RadioOption'
import { SelectOption } from '@/components/Select'
import { Placement } from '@/enums/Placement'
import { RESOURCE_VALIDATION_RULE_SEVERITY, ValidationRuleSeverity } from '@/enums/ValidationRuleSeverity'
import { Localization, localize } from '@/localization/i18n'

export const FORM_FIELD_CODES = {
  NAME: 'name',
  SEVERITY: 'severity',
  LIST_MODE: 'listMode',
  VALIDATED_FIELDS: 'validatedFields',
  DEPENDENT_FIELDS: 'dependentFields',
  ISSUE_MESSAGE: 'issueMessage',
  RULE: 'rule',
}

export const severityOptions = [
  new RadioOption({
    value: ValidationRuleSeverity.WARNING,
    text: RESOURCE_VALIDATION_RULE_SEVERITY[ValidationRuleSeverity.WARNING],
  }),
  new RadioOption({
    value: ValidationRuleSeverity.ERROR,
    text: RESOURCE_VALIDATION_RULE_SEVERITY[ValidationRuleSeverity.ERROR],
  }),
]

export const ListMode = {
  FOR_EACH: 'forEach',
  FOR_ANY: 'forAny',
}

export const listModeOptions = [
  new SelectOption(
    ListMode.FOR_ANY,
    localize(Localization.FOR_ANY_ITEM),
    {
      title: localize(Localization.FOR_ANY_LIST_MODE_TOOLTIP),
      placement: Placement.RIGHT,
    },
  ),
  new SelectOption(
    ListMode.FOR_EACH,
    localize(Localization.FOR_EACH_ITEM),
    {
      title: localize(Localization.FOR_EACH_LIST_MODE_TOOLTIP),
      placement: Placement.RIGHT,
    },
  ),
]

export const ALPHANUMERIC_WITH_UNDERSCORE_DASH_REGEX = /^[\p{L}0-9_-]*$/u

export const CHAR_TYPE = {
  ALPHANUMERIC: 'alphanumeric',
  BOOLEAN: 'boolean',
}
