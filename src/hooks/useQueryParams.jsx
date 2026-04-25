
import queryString from 'query-string'
import { useMemo, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { queryStringify } from '@/utils/queryString'

export const useQueryParams = () => {
  const location = useLocation()
  const history = useHistory()

  const queryParams = useMemo(() => queryString.parse(
    location.search,
    {
      parseBooleans: true,
    },
  ), [location.search])

  const setQueryParams = useCallback((newParams) => {
    history.replace({
      search: queryStringify(newParams),
    })
  }, [history])

  const updateQueryParams = useCallback((newQueryParams) => {
    const newParams = {
      ...queryParams,
      ...newQueryParams,
    }

    history.replace({
      search: queryStringify(newParams),
    })
  }, [history, queryParams])

  return {
    queryParams,
    setQueryParams,
    updateQueryParams,
  }
}
