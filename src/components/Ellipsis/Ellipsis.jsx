
import { Typography } from 'antd/es'
import PropTypes from 'prop-types'
import { useState } from 'react'

const Ellipsis = ({
  children,
  rows,
  tooltip,
  ...restProps
}) => {
  const [shouldShowTooltip, setShouldShowTooltip] = useState(tooltip)

  return (
    <Typography.Paragraph
      {...restProps}
      ellipsis={
        {
          rows,
          tooltip: shouldShowTooltip,
          onEllipsis: setShouldShowTooltip,
        }
      }
    >
      {children}
    </Typography.Paragraph>
  )
}

Ellipsis.propTypes = {
  children: PropTypes.string,
  rows: PropTypes.number.isRequired,
  tooltip: PropTypes.bool,
}

export { Ellipsis }
