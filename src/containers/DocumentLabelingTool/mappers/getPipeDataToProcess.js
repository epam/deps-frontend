
const getPageMarkupToProcess = (markupObjects, page, docTypeFieldCode) => {
  const pageMarkup = []

  markupObjects.forEach((markupObject) => {
    if (markupObject.fieldCode === docTypeFieldCode) {
      pageMarkup.push([page, markupObject])
    }
  })

  return pageMarkup
}

const getMarkupToProcess = (markup, docTypeFieldCode) => {
  const markupToProcess = []

  Object.entries(markup)
    .forEach(([page, pageMarkup]) => {
      Object.values(pageMarkup).forEach((markupObjects) => {
        const pageMarkup = getPageMarkupToProcess(markupObjects, +page, docTypeFieldCode)
        pageMarkup.length && markupToProcess.push(...pageMarkup)
      })
    })

  return markupToProcess.sort(([, aLabel], [, bLabel]) => aLabel.index - bLabel.index)
}

const getPipeDataToProcess = (markup, documentTypeFields) => {
  const pipeData = []

  documentTypeFields.forEach((dtField) => {
    const markupToProcess = getMarkupToProcess(markup, dtField.code)

    if (markupToProcess.length) {
      pipeData.push({
        dtField,
        markupToProcess,
      })
    }
  })

  return pipeData
}

export { getPipeDataToProcess }
