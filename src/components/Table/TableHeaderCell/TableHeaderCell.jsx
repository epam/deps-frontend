
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import isRequiredIf from 'react-proptype-conditional-require'
import { StyledResizable } from './TableHeaderCell.styles'

const RESIZABLE_AXIS = 'x'
export const RESIZABLE_HANDLE_CLASS_NAME = 'react-resizable-handle'
export const RESIZABLE_HANDLE_TEST_ID = 'resizable-handle'

export const TableHeaderCell = ({
  onResize,
  onClick,
  resizableWidth,
  isResizing,
  onResizeStart,
  onResizeStop,
  ...restProps
}) => {
  const handleResizableCellClick = useCallback((...clickArgs) => {
    if (isResizing || !onClick) {
      return
    }

    onClick(...clickArgs)
  }, [onClick, isResizing])

  if (!onResize) {
    return (
      <th
        onClick={onClick}
        {...restProps}
      />
    )
  }

  return (
    <StyledResizable
      $isResizing={isResizing}
      axis={RESIZABLE_AXIS}
      draggableOpts={
        {
          enableUserSelectHack: true,
          grid: [1, 1],
        }
      }
      handle={
        (
          <span
            className={RESIZABLE_HANDLE_CLASS_NAME}
            data-testid={RESIZABLE_HANDLE_TEST_ID}
          />
        )
      }
      onResize={onResize}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      width={resizableWidth}
    >
      <th
        onClick={handleResizableCellClick}
        {...restProps}
      />
    </StyledResizable>
  )
}

TableHeaderCell.propTypes = {
  onResize: PropTypes.func,
  onClick: PropTypes.func,
  resizableWidth: isRequiredIf(PropTypes.number, (props) => !!props.onResize),
  isResizing: isRequiredIf(PropTypes.bool, (props) => !!props.onResize),
  onResizeStart: isRequiredIf(PropTypes.func, (props) => !!props.onResize),
  onResizeStop: isRequiredIf(PropTypes.func, (props) => !!props.onResize),
}
