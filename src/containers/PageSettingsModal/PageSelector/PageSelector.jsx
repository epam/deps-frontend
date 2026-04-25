
import PropTypes from 'prop-types'
import { useState } from 'react'
import { optionShape } from '@/components/Select'
import { KeyCode } from '@/enums/KeyCode'
import { Select } from './PageSelector.styles'

const PageSelector = ({
  isValid,
  onChange,
  options,
  value,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const onStartPageKeyDown = (e) => {
    if (e.keyCode === KeyCode.ENTER) {
      e.stopPropagation()
      onChange(e.target.value)
      setIsDropdownOpen(false)
    }
  }

  return (
    <Select
      $error={!isValid}
      allowSearch
      onChange={onChange}
      onDropdownVisibleChange={(visible) => setIsDropdownOpen(visible)}
      onInputKeyDown={onStartPageKeyDown}
      open={isDropdownOpen}
      options={options}
      value={value}
    />
  )
}

PageSelector.propTypes = {
  isValid: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(optionShape).isRequired,
  value: PropTypes.string.isRequired,
}

export {
  PageSelector,
}
