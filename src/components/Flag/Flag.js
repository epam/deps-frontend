
import { createElement } from '@/utils/document'
import './Flag.css'

const className = 'flag'

const renderFlag = (
  mark,
  onMouseEnter,
  onMouseLeave,
  backgroundColor = 'transparent',
) => {
  const flag = createElement('div', className)
  flag.textContent = mark
  flag.onmouseenter = onMouseEnter
  flag.onmouseleave = onMouseLeave
  flag.style.backgroundColor = backgroundColor
  return flag
}

export {
  renderFlag,
}
