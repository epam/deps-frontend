
import PropTypes from 'prop-types'
import { CONFIDENCE_BREAKPOINT } from '@/constants/confidence'
import { ConfidenceLevel, ConfidenceLevelView } from '@/enums/ConfidenceLevel'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import {
  HintItem,
  Round,
  TextValue,
  PercentageRatio,
} from './ConfidenceLevelRangeHint.styles'

const CONFIDENCE_LEVEL_TO_ITEM_DISPLAY = {
  [ConfidenceLevel.LOW]: localize(Localization.LOW),
  [ConfidenceLevel.MEDIUM]: localize(Localization.MEDIUM),
  [ConfidenceLevel.HIGH]: localize(Localization.HIGH),
  [ConfidenceLevel.NOT_APPLICABLE]: localize(Localization.NA_CONFIDENCE_LEVEL_TOOLTIP),
}

const PERCENTAGE_RATIO_TO_ITEM_DISPLAY = {
  [ConfidenceLevel.LOW]: `(0 - ${CONFIDENCE_BREAKPOINT.LOW - 1}%)`,
  [ConfidenceLevel.MEDIUM]: `(${CONFIDENCE_BREAKPOINT.LOW} - ${CONFIDENCE_BREAKPOINT.MEDIUM - 1}%)`,
  [ConfidenceLevel.HIGH]: `(${CONFIDENCE_BREAKPOINT.MEDIUM} - 100%)`,
}

const ConfidenceLevelRangeHint = ({ confidenceLevel }) => (
  <HintItem>
    <Round type={confidenceLevel} />
    <TextValue>
      {CONFIDENCE_LEVEL_TO_ITEM_DISPLAY[confidenceLevel]}
    </TextValue>
    {
      ENV.FEATURE_CONFIDENCE_LEVEL_VIEW === ConfidenceLevelView.AS_NUMBERS && (
        <PercentageRatio>
          {PERCENTAGE_RATIO_TO_ITEM_DISPLAY[confidenceLevel]}
        </PercentageRatio>
      )
    }
  </HintItem>
)

ConfidenceLevelRangeHint.propTypes = {
  confidenceLevel: PropTypes.oneOf(
    Object.values(ConfidenceLevel),
  ).isRequired,
}

export {
  ConfidenceLevelRangeHint,
}
