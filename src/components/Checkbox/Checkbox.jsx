
import AntdCheckbox from 'antd/es/checkbox'
import 'antd/lib/checkbox/style/index.less'
import PropTypes from 'prop-types'
import { Component } from 'react'

class Checkbox extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.bool,
    checked: PropTypes.bool,
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
  }

  onChange = (e) => this.props.onChange && this.props.onChange(e.target.checked)

  render = () => {
    const { onChange, value, checked, innerRef, ...restProps } = this.props
    return (
      <AntdCheckbox
        {...restProps}
        ref={innerRef}
        checked={checked || value}
        onChange={this.onChange}
      />
    )
  }
}

export {
  Checkbox,
}
