
const createElement = (tag, className = '') => {
  const element = document.createElement(tag)
  className && element.classList.add(className)
  return element
}

export {
  createElement,
}
