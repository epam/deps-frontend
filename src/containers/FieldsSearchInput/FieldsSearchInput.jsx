
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { Localization, localize } from '@/localization/i18n'
import { StyledInput } from './FieldsSearchInput.styles'

const DEBOUNCE_TIME = 500

const FieldsSearchInput = ({
  onChange,
  shouldClear,
  placeholder,
}) => {
  const [value, setValue] = useState('')

  const debounceOnChange = useMemo(() =>
    debounce((value) => {
      onChange(value)
    }, DEBOUNCE_TIME),
  [onChange],
  )

  const updateSearchValue = useCallback((value) => {
    setValue(value)
    debounceOnChange(value)
  }, [debounceOnChange])

  useEffect(() => {
    if (shouldClear) {
      updateSearchValue('')
    }
  }, [shouldClear, updateSearchValue])

  const onValueChange = (e) => {
    const { value } = e.target

    updateSearchValue(value)
  }

  return (
    <StyledInput
      onChange={onValueChange}
      placeholder={placeholder || localize(Localization.SEARCH)}
      prefix={<SearchIcon />}
      value={value}
    />
  )
}

FieldsSearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  shouldClear: PropTypes.bool,
  placeholder: PropTypes.string,
}

export {
  FieldsSearchInput,
}
