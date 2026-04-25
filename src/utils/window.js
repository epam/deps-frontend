
const getComputedStyleProperty = (el, prop) => (
  window.getComputedStyle(el).getPropertyValue(prop)
)

const outerHeight = (el) => {
  const marginTop = parseInt(getComputedStyleProperty(el, 'margin-top'))
  const marginBottom = parseInt(getComputedStyleProperty(el, 'margin-bottom'))
  return el.offsetHeight + marginTop + marginBottom
}

const openInNewTarget = (event, url, cb) => {
  if (event.shiftKey) {
    document.getSelection().empty()
    window.open(url, '_blank')
    return
  }

  if (event.ctrlKey || event.metaKey) {
    window.open(url)
    return
  }

  cb()
}

export {
  outerHeight,
  openInNewTarget,
}
