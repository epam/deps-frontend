
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { Tooltip } from '@/components/Tooltip'
import { Placement } from '@/enums/Placement'
import { IconButton as Button } from './IconButton.styles'

const IconButton = forwardRef(
  (
    { icon, loading, tooltip, ...restProps },
    ref,
  ) => {
    if (tooltip) {
      return (
        <Tooltip
          {...tooltip}
        >
          <Button
            {...restProps}
            ref={ref}
          >
            {icon}
          </Button>
        </Tooltip>
      )
    }

    return (
      <Button
        {...restProps}
        ref={ref}
      >
        {icon}
      </Button>
    )
  },
)

IconButton.propTypes = {
  icon: PropTypes.element.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  tooltip: PropTypes.shape({
    title: PropTypes.string,
    placement: PropTypes.oneOf(Object.values(Placement)),
  }),
}

export {
  IconButton,
}
