
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { StyledTag } from './Tag.styles'

const dataTestId = 'tag'

const TEST_ID = {
  CLOSE_ICON: 'close-icon',
}

const defaultCloseIcon = (
  <XMarkIcon data-testid={TEST_ID.CLOSE_ICON} />
)

const Tag = forwardRef(({
  closeIcon = defaultCloseIcon,
  ...restProps
}, ref) => (
  <StyledTag
    ref={ref}
    closable
    closeIcon={closeIcon}
    data-testid={dataTestId}
    {...restProps}
  />
))

Tag.propTypes = {
  closeIcon: PropTypes.element,
}

export {
  Tag,
}
