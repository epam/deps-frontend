import { localize, Localization } from '@/localization/i18n'

const EmailProperty = {
  SENDER: 'sender',
  RECIPIENTS: 'recipients',
  CC: 'cc',
  BCC: 'bcc',
  SUBJECT: 'subject',
  DATE: 'date',
}

const RESOURCE_EMAIL_PROPERTY = {
  [EmailProperty.SENDER]: localize(Localization.FROM),
  [EmailProperty.RECIPIENTS]: localize(Localization.TO),
  [EmailProperty.CC]: localize(Localization.CC),
  [EmailProperty.BCC]: localize(Localization.BCC),
  [EmailProperty.SUBJECT]: localize(Localization.SUBJECT),
  [EmailProperty.DATE]: localize(Localization.DATE),
}

export {
  RESOURCE_EMAIL_PROPERTY,
  EmailProperty,
}
