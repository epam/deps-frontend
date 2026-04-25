
import AntdInputNumber from 'antd/es/input-number'
import 'antd/lib/input-number/style/index.less'
import PropTypes from 'prop-types'
import { useCallback } from 'react'

const ALLOWED_TO_KEY_DOWN_REGEXP = /^\d+$|Backspace|Delete|ArrowRight|ArrowLeft|-/

const InputNumber = ({
  innerRef,
  ...rest
}) => {
  const onKeyDown = useCallback((e) => {
    if (!ALLOWED_TO_KEY_DOWN_REGEXP.test(e.key)) {
      e.preventDefault()
    }
  }, [])

  return (
    <AntdInputNumber
      {...rest}
      ref={innerRef}
      onKeyDown={onKeyDown}
    />
  )
}

InputNumber.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
}

export {
  InputNumber,
}
