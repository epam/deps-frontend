
const getComputedStyle = (element, property) => {
  const value = window
    .getComputedStyle(element, null)
    .getPropertyValue(property)

  return parseInt(value, 10)
}

export {
  getComputedStyle,
}
