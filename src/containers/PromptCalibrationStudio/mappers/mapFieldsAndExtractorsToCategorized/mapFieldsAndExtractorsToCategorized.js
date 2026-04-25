
import isEqual from 'lodash/isEqual'

const categorizeItems = (currentItems, initialItems) => {
  const initialItemsMap = new Map(
    initialItems.map((item) => [item.id, item]),
  )

  return currentItems.reduce((acc, currentItem) => {
    const initialItem = initialItemsMap.get(currentItem.id)

    if (!initialItem) {
      acc.created.push(currentItem)
      return acc
    }

    const hasChanged = !isEqual(currentItem, initialItem)

    if (hasChanged) {
      acc.updated.push(currentItem)
    }

    return acc
  }, {
    created: [],
    updated: [],
  })
}

export const mapFieldsAndExtractorsToCategorized = ({
  currentFields = [],
  initialFields = [],
  currentExtractors = [],
  initialExtractors = [],
}) => {
  const categorizedFields = categorizeItems(currentFields, initialFields)
  const categorizedExtractors = categorizeItems(currentExtractors, initialExtractors)

  return {
    categorizedFields,
    categorizedExtractors,
  }
}
