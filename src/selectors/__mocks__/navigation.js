
import { mockSelector } from '@/mocks/mockSelector'
import { SELECTED_RECORDS, FILTERS, PAGINATION, DocumentFilterKeys, PaginationKeys, UiKeys } from '@/constants/navigation'

const filters = {
  [DocumentFilterKeys.REVIEWER]: [],
  [DocumentFilterKeys.LABELS]: [],
  [DocumentFilterKeys.TITLE]: '',
  [DocumentFilterKeys.TYPES]: [],
  [DocumentFilterKeys.STATES]: [],
  [DocumentFilterKeys.SORT_DIRECT]: '',
  [DocumentFilterKeys.SORT_FIELD]: '',
  [DocumentFilterKeys.DATE_RANGE]: [],
  [DocumentFilterKeys.SEARCH]: '',
}

const pagination = {
  [PaginationKeys.PAGE]: 1,
  [PaginationKeys.PER_PAGE]: 10,
}

const filterSelector = mockSelector({
  [FILTERS]: filters,
  [PAGINATION]: pagination,
})

const navigationSelector = mockSelector({
  [FILTERS]: filters,
  [PAGINATION]: pagination,
  [SELECTED_RECORDS]: ['1'],
})

const uiSelector = mockSelector({
  [UiKeys.RECT_COORDS]: [
    {
      height: 26,
      left: 1759,
      top: 315,
      width: 60,
    },
  ],
  [UiKeys.CELL_RANGES]: [
    [0, 0],
    [0, 1, 1, 0],
  ],
  [UiKeys.ACTIVE_PAGE]: 1,
  [UiKeys.ACTIVE_SOURCE_ID]: 'asdasdasd123asd',
  [UiKeys.ACTIVE_FIELD_PK]: 1,
  [UiKeys.SCROLL_ID]: 'ListOfTable0',
  [UiKeys.VISIBLE_PDF_PAGE]: 1,
})

const selectionSelector = mockSelector(['1'])

export {
  uiSelector,
  filterSelector,
  navigationSelector,
  selectionSelector,
}
