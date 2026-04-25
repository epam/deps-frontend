
import { PaginationKeys } from '@/constants/navigation'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { DefaultPaginationConfig } from './PaginationConfig'

class Pagination {
  static getInitialPagination = (localStorageId) => {
    const userPreferredPagination = localStorageWrapper.getItem(localStorageId)

    return userPreferredPagination
      ? {
        ...DefaultPaginationConfig,
        ...userPreferredPagination,
      }
      : DefaultPaginationConfig
  }

  static setSize = (localStorageId, size) => {
    localStorageWrapper.setItem(localStorageId, { [PaginationKeys.PER_PAGE]: size })
  }
}

export { Pagination }
