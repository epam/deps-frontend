
import { localize, Localization } from '@/localization/i18n'

export const ReviewPolicy = {
  ALWAYS_REVIEW: 'always_review',
  REVIEW_IF_VALIDATION_FAILURE: 'review_if_validation_failure',
  NO_REVIEW: 'no_review',
}

export const REVIEW_POLICY_TO_LABEL = {
  [ReviewPolicy.ALWAYS_REVIEW]: localize(Localization.REVIEW_POLICY_ALWAYS_REVIEW),
  [ReviewPolicy.REVIEW_IF_VALIDATION_FAILURE]: localize(Localization.REVIEW_POLICY_REVIEW_IF_VALIDATION_FAILS),
  [ReviewPolicy.NO_REVIEW]: localize(Localization.REVIEW_POLICY_NO_REVIEW),
}
