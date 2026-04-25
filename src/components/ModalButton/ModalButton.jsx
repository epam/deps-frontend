
import PropTypes from 'prop-types'
import { PureComponent, Fragment } from 'react'
import stylePropType from 'react-style-proptype'
import { Button } from '@/components/Button'
import { ComponentSize } from '@/enums/ComponentSize'
import { localize, Localization } from '@/localization/i18n'
import { Modal } from './ModalButton.styles'

const buttonProps = PropTypes.shape({
  icon: PropTypes.element,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
})

class ModalButton extends PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    size: PropTypes.oneOf([
      ComponentSize.SMALL,
      ComponentSize.DEFAULT,
    ]),
    destroyOnClose: PropTypes.bool,
    style: stylePropType,
    bodyStyle: stylePropType,
    closable: PropTypes.bool,
    maskClosable: PropTypes.bool,
    keyboard: PropTypes.bool,
    width: PropTypes.number,
    okButtonProps: buttonProps,
    onOk: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    renderFooter: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
    ]).isRequired,
    fetching: PropTypes.bool,
    visible: PropTypes.bool,
    renderOpenTrigger: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    destroyOnClose: true,
  }

  state = {
    visible: false,
  }

  getApi = () => ({
    close: this.close,
    open: this.open,
    onOk: this.onOk,
  })

  close = () => {
    const cancel = this.props.onClose && this.props.onClose()
    if (cancel === true) {
      return
    }

    this.setState(() => ({
      visible: false,
    }))
  }

  open = async () => {
    const cancel = this.props.onOpen && (await this.props.onOpen())
    if (cancel === true) {
      return
    }

    this.setState(() => ({
      visible: true,
    }))
  }

  onOk = async () => {
    const cancel = this.props.onOk && (await this.props.onOk())
    if (cancel === true) {
      return
    }

    this.close()
  }

  renderOpen = () => {
    if (this.props.renderOpenTrigger) {
      return this.props.renderOpenTrigger(this.open)
    }

    return (
      <Button.Text
        onClick={this.open}
      >
        {localize(Localization.OPEN)}
      </Button.Text>
    )
  }

  renderCancel = () => (
    <Button
      key="cancel"
      onClick={this.close}
    >
      Cancel
    </Button>
  )

  renderOk = () => {
    const { okButtonProps } = this.props
    const okText = okButtonProps ? okButtonProps.text : 'Ok'
    const okDisabled = okButtonProps ? okButtonProps.disabled : false

    return (
      <Button
        key="ok"
        disabled={okDisabled}
        loading={this.props.fetching}
        onClick={this.onOk}
        type="primary"
      >
        {okText}
      </Button>
    )
  }

  renderFooter = () => {
    if (this.props.renderFooter) {
      return this.props.renderFooter()
    }

    const footer = [
      this.renderCancel(),
    ]

    if (this.props.onOk) {
      footer.push(
        this.renderOk(),
      )
    }

    return footer.length ? footer : null
  }

  renderChildren = () => {
    if (!(this.state.visible || this.props.visible)) {
      return null
    }

    if (typeof this.props.children === 'function') {
      return this.props.children(this.getApi())
    }

    return this.props.children
  }

  renderModal = () => (
    <Modal
      bodyStyle={this.props.bodyStyle}
      centered
      className={this.props.className}
      closable={this.props.closable}
      destroyOnClose={this.props.destroyOnClose}
      footer={this.renderFooter()}
      keyboard={this.props.keyboard}
      maskClosable={this.props.maskClosable}
      onCancel={this.close}
      open={this.props.visible ?? this.state.visible}
      size={this.props.size}
      style={this.props.style}
      title={this.props.title}
      width={this.props.width}
    >
      {
        this.renderChildren()
      }
    </Modal>
  )

  render = () => (
    <Fragment>
      {this.renderOpen()}
      {this.renderModal()}
    </Fragment>
  )
}

export {
  ModalButton,
}
