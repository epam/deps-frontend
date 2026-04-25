
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useFetchDocumentTypesGroupsQuery } from '@/apiRTK/documentTypesGroupsApi'
import { SelectOption } from '@/components/Select'
import { Spin } from '@/components/Spin'
import { FilterOptions } from '@/components/Table/FilterOptions'
import { DocumentTypesGroupsFilterKey, PaginationKeys } from '@/constants/navigation'
import { Wrapper, Search } from './DocumentTypesGroupsFilter.styles'

const GROUPS_PER_PAGE = 30
const GROUPS_INITIAL_PAGE = 0
const SELECT_SCROLL_THRESHOLD = 40

const DocumentTypesGroupsFilter = ({
  confirm,
  selectedKeys,
  setSelectedKeys,
  visible,
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(GROUPS_INITIAL_PAGE)
  const [groups, setGroups] = useState([])

  const filter = {
    [PaginationKeys.PER_PAGE]: GROUPS_PER_PAGE,
    [PaginationKeys.PAGE]: page,
    ...(searchValue && {
      [DocumentTypesGroupsFilterKey.NAME]: searchValue,
    }),
  }

  const {
    data = {},
    isFetching,
  } = useFetchDocumentTypesGroupsQuery(filter)

  useEffect(() => {
    if (data.result?.length) {
      setGroups((prevItems) => [...prevItems, ...data.result])
    }
  }, [data.result, setGroups])

  const selectOptions = groups?.map(
    (group) => new SelectOption(group.id, group.name),
  )

  const confirmFilter = (value) => {
    if (!value?.length) {
      setSearchValue('')
    }

    setSelectedKeys(value)
    confirm()
  }

  const onSearch = (filterValue) => {
    setGroups([])
    setPage(GROUPS_INITIAL_PAGE)
    setSearchValue(filterValue)
  }

  const onScroll = ({ target }) => {
    if (isFetching) {
      return
    }

    const { scrollHeight, clientHeight, scrollTop } = target
    const isNearBottom = scrollHeight - clientHeight - scrollTop < SELECT_SCROLL_THRESHOLD
    const total = data.meta?.total ?? 0

    if (isNearBottom && total > groups.length) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <Wrapper>
      <Spin spinning={isFetching}>
        <Search
          autoFocus={visible}
          filter={searchValue}
          onChange={onSearch}
        />
        <FilterOptions
          confirmFilter={confirmFilter}
          filter={searchValue}
          isFetching={isFetching}
          onScroll={onScroll}
          options={selectOptions}
          savedKeys={selectedKeys}
        />
      </Spin>
    </Wrapper>
  )
}

DocumentTypesGroupsFilter.propTypes = {
  confirm: PropTypes.func.isRequired,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  setSelectedKeys: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export {
  DocumentTypesGroupsFilter,
}
