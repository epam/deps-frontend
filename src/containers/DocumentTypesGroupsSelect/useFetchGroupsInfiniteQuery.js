
import { useEffect, useState } from 'react'
import { useFetchDocumentTypesGroupsQuery } from '@/apiRTK/documentTypesGroupsApi'
import { PaginationKeys } from '@/constants/navigation'
import { GROUPS_INITIAL_PAGE } from './constants'

const DEFAULT_TOTAL = 0

const useFetchGroupsInfiniteQuery = ({ filter, skip }) => {
  const [groups, setGroups] = useState([])

  const {
    data = {},
    isFetching,
  } = useFetchDocumentTypesGroupsQuery(filter, {
    skip,
  })

  useEffect(() => {
    if (data.result?.length) {
      setGroups((prevItems) => {
        const savedGroups = filter[PaginationKeys.PAGE] === GROUPS_INITIAL_PAGE ? [] : prevItems
        const existingIds = new Set(savedGroups.map((item) => item.id))
        const newItems = data.result.filter((item) => !existingIds.has(item.id))
        return [...savedGroups, ...newItems]
      })
    }
  }, [data.result, filter])

  return {
    groups,
    total: data.meta?.total || DEFAULT_TOTAL,
    isFetching,
  }
}

export {
  useFetchGroupsInfiniteQuery,
}
