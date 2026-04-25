
import { renderFlag } from '@/components/Flag'
import { renderTooltip } from '@/components/Tooltip/Tooltip.js'
import { CONFIDENCE_BREAKPOINT, NOT_APPLICABLE_CONFIDENCE_LEVEL } from '@/constants/confidence'
import { ConfidenceLevel, ConfidenceLevelView } from '@/enums/ConfidenceLevel'
import { localize, Localization } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import { createElement } from '@/utils/document'
import { ENV } from '@/utils/env'
import { renderDropdownMenu } from './DropdownMenu'
import './CellExtraData.css'

const className = 'cell_extraData'
const handsontableClassName = '.wtSpreader'
const ERROR_TOOLTIP_MARGIN_BOTTOM = 35
const ERROR_TOOLTIP_ZINDEX = '2'

const EMPTY_ELEMENT = createElement('div', className)

const CONFIDENCE_LEVEL_TO_FLAG_SYMBOL = {
  [ConfidenceLevel.LOW]: localize(Localization.LOW_CONFIDENCE_LEVEL_FLAG),
  [ConfidenceLevel.MEDIUM]: localize(Localization.MEDIUM_CONFIDENCE_LEVEL_FLAG),
  [ConfidenceLevel.HIGH]: localize(Localization.HIGH_CONFIDENCE_LEVEL_FLAG),
  [ConfidenceLevel.NOT_APPLICABLE]: localize(Localization.NA_CONFIDENCE_LEVEL_FLAG),
}

const onFlagMouseEnter = (e) => {
  const flag = e.target
  const tooltipList = flag.nextSibling
  const parentTable = flag.closest(handsontableClassName)
  const tooltipTopOffset = flag.getBoundingClientRect().top - parentTable.getBoundingClientRect().top - ERROR_TOOLTIP_MARGIN_BOTTOM

  tooltipList.style.cssText = `
    top: ${tooltipTopOffset}px;
    z-index: ${ERROR_TOOLTIP_ZINDEX};
    display: block;
    pointer-events: none;
  `
  const tooltipLeftOffset = tooltipList.offsetLeft
  tooltipList.style.left = tooltipLeftOffset < 0 ? 0 : tooltipLeftOffset
}

const onFlagMouseLeave = (e) => {
  const flag = e.target
  const tooltipList = flag.nextSibling

  tooltipList.style.display = 'none'
}

const getFlagConfig = (confidence, confidenceView) => {
  if (
    confidence === NOT_APPLICABLE_CONFIDENCE_LEVEL &&
    confidenceView?.[ConfidenceLevel.NOT_APPLICABLE]
  ) {
    return {
      message: Localization.NA_CONFIDENCE_LEVEL_TOOLTIP,
      theme: theme.color.grayscale22,
      level: ConfidenceLevel.NOT_APPLICABLE,
    }
  }
  if (
    confidence > 0 &&
    confidence < CONFIDENCE_BREAKPOINT.LOW &&
    confidenceView?.[ConfidenceLevel.LOW]
  ) {
    return {
      message: Localization.LOW_CONFIDENCE_LEVEL,
      theme: theme.color.error,
      level: ConfidenceLevel.LOW,
    }
  }
  if (
    confidence < CONFIDENCE_BREAKPOINT.MEDIUM &&
    confidence >= CONFIDENCE_BREAKPOINT.LOW &&
    confidenceView?.[ConfidenceLevel.MEDIUM]
  ) {
    return {
      message: Localization.MEDIUM_CONFIDENCE_LEVEL,
      theme: theme.color.warning,
      level: ConfidenceLevel.MEDIUM,
    }
  }
  if (
    confidence >= CONFIDENCE_BREAKPOINT.MEDIUM &&
    confidenceView?.[ConfidenceLevel.HIGH]
  ) {
    return {
      message: Localization.HIGH_CONFIDENCE_LEVEL,
      theme: theme.color.success,
      level: ConfidenceLevel.HIGH,
    }
  }
}

const flagRenderer = (mark, bgColor) => renderFlag(
  mark,
  onFlagMouseEnter,
  onFlagMouseLeave,
  bgColor,
)

const confidenceFlagRenderer = (confidence, bgColor, level) => {
  if (level === ConfidenceLevel.NOT_APPLICABLE) {
    return renderFlag(CONFIDENCE_LEVEL_TO_FLAG_SYMBOL[level], null, null, bgColor)
  }

  if (
    ENV.FEATURE_CONFIDENCE_LEVEL_VIEW === ConfidenceLevelView.AS_NUMBERS
  ) {
    return flagRenderer(confidence, bgColor)
  }

  return renderFlag(CONFIDENCE_LEVEL_TO_FLAG_SYMBOL[level], null, null, bgColor)
}

const renderCellExtraData = (
  {
    comments,
    modified,
    confidence,
    confidenceView,
  },
  table,
  cellDataHighlighters,
) => {
  const extraData = EMPTY_ELEMENT.cloneNode(true)
  const cellExtra = []

  if (comments) {
    cellExtra.push(
      flagRenderer(
        localize(Localization.COMMENT_FLAG),
        theme.color.primary2,
      ),
      renderTooltip(comments),
    )
  }
  if (modified) {
    cellExtra.push(
      flagRenderer(
        localize(Localization.MODIFIED_FLAG),
        theme.color.grayscale5,
      ),
      renderTooltip([localize(Localization.MODIFIED_BY_USER)]),
    )
  }

  if (ENV.FEATURE_CONFIDENCE_LEVEL_VIEW) {
    const flagConfig = getFlagConfig(confidence, confidenceView)
    if (flagConfig) {
      cellExtra.push(
        confidenceFlagRenderer(
          confidence,
          flagConfig.theme,
          flagConfig.level,
        ),
        renderTooltip([localize(flagConfig.message, { confidence: Math.round(confidence) })]),
      )
    }
  }

  if (cellDataHighlighters) {
    cellExtra.push(renderDropdownMenu(cellDataHighlighters, table))
  }

  extraData.append(...cellExtra)

  return extraData
}

export {
  renderCellExtraData,
}
