
import PropTypes from 'prop-types'
import { useState } from 'react'
import { optionShape } from '@/components/Select'
import { FilterOptions } from '../FilterOptions'
import { Search, Wrapper } from './TableSelectFilter.styles'

const TableSelectFilter = ({
  options,
  setSelectedKeys,
  confirm,
  selectedKeys,
  visible,
}) => {
  const [filter, setFilter] = useState('')

  const confirmFilter = (value) => {
    if (!value?.length) {
      setFilter('')
    }

    setSelectedKeys(value)
    confirm()
  }

  const onSearch = (filterValue) => {
    setFilter(filterValue)
  }

  return (
    <Wrapper>
      <Search
        autoFocus={visible}
        filter={filter}
        onChange={onSearch}
      />
      <FilterOptions
        confirmFilter={confirmFilter}
        filter={filter}
        options={options}
        savedKeys={selectedKeys}
      />
    </Wrapper>
  )
}

TableSelectFilter.propTypes = {
  confirm: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(optionShape).isRequired,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  setSelectedKeys: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export {
  TableSelectFilter,
}
