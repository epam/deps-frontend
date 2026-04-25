
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { AngleDownIcon } from '@/components/Icons/AngleDownIcon'
import { childrenShape } from '@/utils/propTypes'
import { Button } from './SettingsButton.styles'

const SettingsButton = forwardRef(({
  disabled,
  isActive,
  onClick,
  title,
  className,
}, ref) => (
  <Button
    ref={ref}
    $isActive={isActive}
    className={className}
    disabled={disabled}
    onClick={onClick}
  >
    {title}
    <AngleDownIcon />
  </Button>
))

SettingsButton.displayName = 'SettingsButton'

SettingsButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.oneOfType([
    childrenShape,
    PropTypes.string,
  ]),
}

export {
  SettingsButton,
}
