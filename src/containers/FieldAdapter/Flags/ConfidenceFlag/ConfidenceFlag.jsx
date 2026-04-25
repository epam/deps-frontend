
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { connect } from 'react-redux'
import { Flag } from '@/components/Flag'
import { FlagProps } from '@/components/Flag/FlagProps'
import { FlagType } from '@/components/Flag/FlagType'
import { CONFIDENCE_BREAKPOINT, NOT_APPLICABLE_CONFIDENCE_LEVEL } from '@/constants/confidence'
import { ConfidenceLevel, ConfidenceLevelView } from '@/enums/ConfidenceLevel'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { confidenceViewShape } from '@/models/confidenceView'
import { confidenceViewSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'

class ConfidenceFlag {
  static #flagPropsCreator = (symbol, title, type) => (
    new FlagProps(
      symbol,
      type,
      title,
      Placement.TOP,
    )
  )

  static LOW = (confidence) => {
    switch (ENV.FEATURE_CONFIDENCE_LEVEL_VIEW) {
      case ConfidenceLevelView.AS_ICONS:
        return ConfidenceFlag.#flagPropsCreator(localize(Localization.LOW_CONFIDENCE_LEVEL_FLAG), null, FlagType.ERROR)
      default:
        return ConfidenceFlag.#flagPropsCreator(confidence, localize(Localization.LOW_CONFIDENCE_LEVEL, { confidence }), FlagType.ERROR)
    }
  }

  static MEDIUM = (confidence) => {
    switch (ENV.FEATURE_CONFIDENCE_LEVEL_VIEW) {
      case ConfidenceLevelView.AS_ICONS:
        return ConfidenceFlag.#flagPropsCreator(localize(Localization.MEDIUM_CONFIDENCE_LEVEL_FLAG), null, FlagType.WARNING)
      default:
        return ConfidenceFlag.#flagPropsCreator(confidence, localize(Localization.MEDIUM_CONFIDENCE_LEVEL, { confidence }), FlagType.WARNING)
    }
  }

  static HIGH = (confidence) => {
    switch (ENV.FEATURE_CONFIDENCE_LEVEL_VIEW) {
      case ConfidenceLevelView.AS_ICONS:
        return ConfidenceFlag.#flagPropsCreator(localize(Localization.HIGH_CONFIDENCE_LEVEL_FLAG), null, FlagType.SUCCESS)
      default:
        return ConfidenceFlag.#flagPropsCreator(confidence, localize(Localization.HIGH_CONFIDENCE_LEVEL, { confidence }), FlagType.SUCCESS)
    }
  }

  static NOT_APPLICABLE = () => (
    ConfidenceFlag.#flagPropsCreator(
      localize(Localization.NA_CONFIDENCE_LEVEL_FLAG),
      localize(Localization.NA_CONFIDENCE_LEVEL_TOOLTIP),
      FlagType.NOT_APPLICABLE,
    )
  )
}

const Confidence = ({ confidence, confidenceView }) => {
  const confidenceFlag = useMemo(() => {
    if (
      (
        confidence === undefined ||
        confidence === NOT_APPLICABLE_CONFIDENCE_LEVEL
      ) &&
        confidenceView?.[ConfidenceLevel.NOT_APPLICABLE]
    ) {
      return ConfidenceFlag.NOT_APPLICABLE()
    }
    if (
      confidence > 0 &&
      confidence < CONFIDENCE_BREAKPOINT.LOW &&
      confidenceView?.[ConfidenceLevel.LOW]
    ) {
      return ConfidenceFlag.LOW(confidence)
    }
    if (
      confidence < CONFIDENCE_BREAKPOINT.MEDIUM &&
      confidence >= CONFIDENCE_BREAKPOINT.LOW &&
      confidenceView?.[ConfidenceLevel.MEDIUM]
    ) {
      return ConfidenceFlag.MEDIUM(confidence)
    }
    if (
      confidence >= CONFIDENCE_BREAKPOINT.MEDIUM &&
      confidenceView?.[ConfidenceLevel.HIGH]
    ) {
      return ConfidenceFlag.HIGH(confidence)
    }
  }, [confidence, confidenceView])

  if (!ENV.FEATURE_CONFIDENCE_LEVEL_VIEW || !confidenceFlag) {
    return null
  }

  return (
    <Flag {...confidenceFlag} />
  )
}

Confidence.propTypes = {
  confidence: PropTypes.number,
  confidenceView: confidenceViewShape,
}

const mapStateToProps = (state) => ({
  confidenceView: confidenceViewSelector(state),
})

const ConnectedConfidence = connect(mapStateToProps)(Confidence)

export {
  ConnectedConfidence as ConfidenceFlag,
}
