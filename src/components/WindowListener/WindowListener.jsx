
import PropTypes from 'prop-types'
import { PureComponent } from 'react'

class WindowListener extends PureComponent {
  static propTypes = {
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onMouseMove: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
  }

  componentDidMount = () => {
    this.props.onMouseDown && window.addEventListener('mousedown', this.props.onMouseDown)
    this.props.onMouseMove && window.addEventListener('mousemove', this.props.onMouseMove)
    this.props.onMouseUp && window.addEventListener('mouseup', this.props.onMouseUp)
    this.props.onKeyDown && window.addEventListener('keydown', this.props.onKeyDown)
    this.props.onKeyUp && window.addEventListener('keyup', this.props.onKeyUp)
  }

  componentWillUnmount = () => {
    this.props.onMouseDown && window.removeEventListener('mousedown', this.props.onMouseDown)
    this.props.onMouseMove && window.removeEventListener('mousemove', this.props.onMouseMove)
    this.props.onMouseUp && window.removeEventListener('mouseup', this.props.onMouseUp)
    this.props.onKeyDown && window.removeEventListener('keydown', this.props.onKeyDown)
    this.props.onKeyUp && window.removeEventListener('keyup', this.props.onKeyUp)
  }

  render = () => null
}

export {
  WindowListener,
}
