
import PropTypes from 'prop-types'
import { SearchInput } from '@/containers/SearchInput'
import { Wrapper } from './TableSearchDropdown.styles'

const TableSearchDropdown = ({
  searchValue,
  onChange,
  confirm,
  visible,
}) => {
  const onSearch = (val) => {
    onChange(val)
    confirm()
  }

  return (
    <Wrapper>
      <SearchInput
        autoFocus={visible}
        filter={searchValue}
        onChange={onSearch}
      />
    </Wrapper>
  )
}

TableSearchDropdown.propTypes = {
  searchValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export {
  TableSearchDropdown,
}
