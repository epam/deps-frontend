
import { renderTooltip } from '@/components/Tooltip/Tooltip.js'
import { theme } from '@/theme/theme.default'

const CELL_TOOLTIP_MARGIN_BOTTOM = 5
const CELL_TOOLTIP_ZINDEX = '2'

const onMouseEnter = (e) => {
  const cell = e.target
  const tooltipList = cell.firstElementChild
  const tooltipBottomPosition = window.innerHeight - cell.getBoundingClientRect().top + CELL_TOOLTIP_MARGIN_BOTTOM
  const tooltipListLeftOffset = cell.getBoundingClientRect().left
  const tooltipListRightOffset = window.innerWidth - tooltipListLeftOffset - cell.offsetWidth

  tooltipList.style.cssText = `
    position: fixed;
    bottom: ${tooltipBottomPosition}px;
    right: ${tooltipListRightOffset}px;
    z-index: ${CELL_TOOLTIP_ZINDEX};
    display: block;
    pointer-events: none;
  `
}

const onMouseLeave = (e) => {
  const cell = e.target
  const tooltipList = cell.firstElementChild
  tooltipList.style.display = 'none'
}

const renderCell = (instance, td, row, col, prop, value, { readOnly }, extra, errors, warnings) => {
  td.textContent = value
  readOnly && (td.style.color = theme.color.grayScale8)
  warnings && (td.style.background = theme.color.warningBg)
  errors && (td.style.background = theme.color.errorBg)

  const validationMessages = [...(errors ?? []), ...(warnings ?? [])]

  if (validationMessages.length) {
    td.append(renderTooltip(validationMessages))
    td.onmouseenter = onMouseEnter
    td.onmouseleave = onMouseLeave
  }

  extra && td.appendChild(extra)
  return td
}

export {
  renderCell,
}
