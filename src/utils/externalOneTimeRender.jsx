
import PropTypes from 'prop-types'
import { cloneElement, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { Provider as StoreProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { store } from '@/application/Provider/contexts/store'
import { theme } from '@/theme/theme.default'
import { childrenShape } from '@/utils/propTypes'

class OneTimeRender extends PureComponent {
  static propTypes = {
    unmount: PropTypes.func.isRequired,
    children: childrenShape.isRequired,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  state = {
    visible: true,
  }

  hide = () => {
    this.setState({ visible: false })
  }

  onCancel = async (...args) => {
    try {
      this.props.onCancel && (await this.props.onCancel(...args))
    } finally {
      this.hide()
    }
  }

  onOk = async (...args) => {
    try {
      this.props.onOk && (await this.props.onOk(...args))
    } finally {
      this.hide()
    }
  }

  componentDidUpdate = () => {
    this.props.unmount()
  }

  render = () => this.state.visible && (
    cloneElement(
      this.props.children,
      {
        onOk: this.onOk,
        onCancel: this.onCancel,
      },
    )
  )
}

const externalOneTimeRender = (Component, props) => {
  const root = document.getRootNode()
  const externalRoot = document.createElement('div')
  root.body.appendChild(externalRoot)

  const unmount = () => {
    ReactDOM.unmountComponentAtNode(externalRoot)
    externalRoot.remove()
  }

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <StoreProvider store={store}>
        <OneTimeRender
          onCancel={props.onCancel}
          onOk={props.onOk}
          unmount={unmount}
        >
          <Component />
        </OneTimeRender>
      </StoreProvider>
    </ThemeProvider>,

    externalRoot,
  )
}

export {
  externalOneTimeRender,
}
