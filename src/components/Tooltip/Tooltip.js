
import { createElement } from '@/utils/document'
import './Tooltip.css'

const bulletSymbol = '•'
const className = 'tooltip'

const renderMessages = (messages) => {
  const list = createElement('ul')

  messages.forEach((m) => {
    const element = createElement('li')
    element.textContent = `${bulletSymbol} ${m}`
    list.append(element)
  })
  return list
}

const renderTooltip = (messages) => {
  const tooltip = createElement('div', className)
  const list = renderMessages(messages)
  tooltip.append(list)
  return tooltip
}

export {
  renderTooltip,
}
