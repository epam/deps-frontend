
import PropTypes from 'prop-types'
import { forwardRef, PureComponent, Component } from 'react'
import { StyledInput } from './Input.styles'

const Password = ({ innerRef, ...rest }) => (
  <StyledInput.Password
    ref={innerRef}
    {...rest}
  />
)

Password.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]),
}

const TextArea = ({ innerRef, ...rest }) => (
  <StyledInput.TextArea
    ref={innerRef}
    {...rest}
  />
)

TextArea.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]),
}

class Input extends PureComponent {
  static propTypes = {
    addonAfter: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    onChange: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onPressEnter: PropTypes.func,
    suffix: PropTypes.element,
    prefix: PropTypes.element,
    allowClear: PropTypes.bool,
    titleFilter: PropTypes.string,
    className: PropTypes.string,
    innerRef: PropTypes.oneOfType([
      PropTypes.func,
      // eslint-disable-next-line react/forbid-prop-types
      PropTypes.shape({ current: PropTypes.any }),
    ]),
  }

  render = () => {
    const props = {
      ...this.props,
      ref: this.props.innerRef,
    }

    delete props.innerRef

    return (
      <StyledInput
        {...props}
      />
    )
  }
}

const WrappedInput = forwardRef((props, ref) => (
  <Input
    innerRef={ref}
    {...props}
  />
))

WrappedInput.Password = Password
WrappedInput.TextArea = TextArea

export {
  WrappedInput as Input,
}
