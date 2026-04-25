
export const getFieldId = (edField, index) => {
  if (!edField || !Array.isArray(edField.data) || !index) {
    return
  }

  return edField.data[index - 1]?.id
}
