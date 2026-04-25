
import lodashDebounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { CustomSelect, SelectOption } from '@/components/Select'
import { Spin } from '@/components/Spin'
import { DocumentTypesGroupsFilterKey, PaginationKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { documentTypesGroupShape } from '@/models/DocumentTypesGroup'
import {
  defaultFilterConfig,
  GROUPS_INITIAL_PAGE,
  GROUPS_PER_PAGE,
} from './constants'
import { useFetchGroupsInfiniteQuery } from './useFetchGroupsInfiniteQuery'

const GROUPS_SELECT_SCROLL_THRESHOLD = 40
const DEBOUNCE_TIME = 300

const DocumentTypesGroupsSelect = ({ value, onChange }) => {
  const [filter, setFilter] = useState(defaultFilterConfig)
  const [isSearching, setIsSearching] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const {
    groups,
    total,
    isFetching,
  } = useFetchGroupsInfiniteQuery({
    filter,
    skip: !isDropdownOpen,
  })

  const onGroupsScroll = ({ target }) => {
    if (isFetching) {
      return
    }

    const { scrollHeight, clientHeight, scrollTop } = target
    const isNearBottom = scrollHeight - clientHeight - scrollTop < GROUPS_SELECT_SCROLL_THRESHOLD

    if (isNearBottom && total > groups.length) {
      setFilter((prev) => ({
        ...prev,
        [PaginationKeys.PAGE]: prev[PaginationKeys.PAGE] + 1,
      }))
    }
  }

  const debouncedOnGroupSearch = useMemo(
    () => lodashDebounce(
      (val) => {
        const filter = {
          [PaginationKeys.PER_PAGE]: GROUPS_PER_PAGE,
          [PaginationKeys.PAGE]: GROUPS_INITIAL_PAGE,
          ...(
            val
              ? { [DocumentTypesGroupsFilterKey.NAME]: val }
              : {}
          ),
        }

        setFilter(filter)
        setIsSearching(false)
      }, DEBOUNCE_TIME,
    ),
    [setFilter],
  )

  const onSearch = (val) => {
    setIsSearching(true)
    debouncedOnGroupSearch(val)
  }

  const dropdownRender = (items) => (
    <Spin spinning={isFetching || isSearching}>
      {items}
    </Spin>
  )

  const handleGroupChange = (selectedGroupId) => {
    const group = groups?.find(({ id }) => id === selectedGroupId)
    onChange(group)
  }

  const handleDropdownVisibleChange = (open) => {
    setIsDropdownOpen(open)
    !isDropdownOpen && setFilter(defaultFilterConfig)
  }

  const selectOptions = useMemo(() => (
    groups?.map((group) => new SelectOption(group.id, group.name))
  ), [groups])

  return (
    <CustomSelect
      allowClear
      allowSearch
      dropdownRender={dropdownRender}
      fetching={isFetching}
      onChange={handleGroupChange}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      onPopupScroll={onGroupsScroll}
      onSearch={onSearch}
      options={selectOptions || []}
      placeholder={localize(Localization.SELECT_DOCUMENT_TYPES_GROUP)}
      value={value?.id}
    />
  )
}

DocumentTypesGroupsSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: documentTypesGroupShape,
}

export {
  DocumentTypesGroupsSelect,
}
