
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { connect } from 'react-redux'
import { setFilters } from '@/actions/navigation'
import { DocumentFilterKeys } from '@/constants/navigation'
import { SearchInput } from '@/containers/SearchInput'
import { filterSelector } from '@/selectors/navigation'
import { Wrapper } from './GlobalSearch.styles'

const GlobalSearch = ({
  setFilters,
  searchFilter,
}) => {
  const setSearch = useCallback(
    (value) => {
      setFilters({
        [DocumentFilterKeys.SEARCH]: value,
      })
    },
    [setFilters],
  )

  return (
    <Wrapper>
      <SearchInput
        filter={searchFilter}
        onChange={setSearch}
      />
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  searchFilter: filterSelector(state)[DocumentFilterKeys.SEARCH] || '',
})

const ConnectedComponent = connect(mapStateToProps, {
  setFilters,
})(GlobalSearch)

GlobalSearch.propTypes = {
  setFilters: PropTypes.func.isRequired,
  searchFilter: PropTypes.string,
}

export {
  ConnectedComponent as GlobalSearch,
}
