
import lodashDebounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react'
import { localize, Localization } from '@/localization/i18n'
import { Input, SearchIcon } from './SearchInput.styles'

const DEBOUNCE_TIME = 250
const DEFAULT_PLACEHOLDER = localize(Localization.SEARCH)

const setFocus = (el) => {
  setTimeout(() => {
    el.focus()
  })
}

const SearchInput = ({
  onChange,
  filter,
  className,
  autoFocus,
  placeholder = DEFAULT_PLACEHOLDER,
  onClick,
}) => {
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    setSearchValue(filter)

    if (autoFocus && inputRef.current) {
      setFocus(inputRef.current)
    }
  }, [filter, autoFocus])

  const onSearch = useCallback(
    () => onChange(searchValue),
    [onChange, searchValue],
  )

  const debouncedOnChange = useMemo(
    () => lodashDebounce(
      (val) => onChange(val),
      DEBOUNCE_TIME,
    ),
    [onChange],
  )

  const onChangeFilter = useCallback(
    (e) => {
      const { value } = e.target
      setSearchValue(value)
      debouncedOnChange(value)
    },
    [debouncedOnChange],
  )

  return (
    <Input
      allowClear
      autoFocus={autoFocus}
      className={className}
      innerRef={inputRef}
      onChange={onChangeFilter}
      onClick={onClick}
      onPressEnter={onSearch}
      placeholder={placeholder}
      suffix={
        (
          <SearchIcon
            onClick={onSearch}
          />
        )
      }
      value={searchValue}
    />
  )
}

SearchInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  onClick: PropTypes.func,
}

export {
  SearchInput,
}
