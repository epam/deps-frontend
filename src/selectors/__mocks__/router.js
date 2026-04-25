
import { mockSelector } from '@/mocks/mockSelector'
import { navigationMap } from '@/utils/navigationMap'

const searchParamsSelector = mockSelector({
  highlightedField: 'mockHighlightedFieldPk',
})

const searchSelector = mockSelector('?key=value')

const pathNameSelector = mockSelector(navigationMap.documents())

export {
  searchSelector,
  searchParamsSelector,
  pathNameSelector,
}
