
import { Localization, localize } from '@/localization/i18n'

const ValidationRuleSeverity = {
  WARNING: 'warning',
  ERROR: 'error',
}

const RESOURCE_VALIDATION_RULE_SEVERITY = {
  [ValidationRuleSeverity.WARNING]: localize(Localization.WARNING),
  [ValidationRuleSeverity.ERROR]: localize(Localization.ERROR),
}

export {
  ValidationRuleSeverity,
  RESOURCE_VALIDATION_RULE_SEVERITY,
}
