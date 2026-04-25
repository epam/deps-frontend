
import { PaginationKeys } from '@/constants/navigation'

export const GROUPS_PER_PAGE = 30

export const GROUPS_INITIAL_PAGE = 0

export const defaultFilterConfig = {
  [PaginationKeys.PAGE]: GROUPS_INITIAL_PAGE,
  [PaginationKeys.PER_PAGE]: GROUPS_PER_PAGE,
}
