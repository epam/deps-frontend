
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { CustomForm } from '@/components/Form'
import { ModalButton } from '@/components/ModalButton'
import { ComponentSize } from '@/enums/ComponentSize'

class ModalFormButton extends PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]).isRequired,
    text: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
    ]),
    size: PropTypes.oneOf([
      ComponentSize.SMALL,
      ComponentSize.DEFAULT,
    ]),
    width: PropTypes.number,
    fields: CustomForm.propTypes.fields,
    renderOpenTrigger: ModalButton.propTypes.renderOpenTrigger,
    okButtonProps: ModalButton.propTypes.okButtonProps,
    areValuesChanged: PropTypes.func,
    onOk: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    fetching: PropTypes.bool,
    visible: PropTypes.bool,
    className: PropTypes.string,
  }

  state = {
    values: null,
    okDisabled: true,
  }

  onOk = () => this.props.onOk(this.state.values)

  shouldDisableOk = (values, errors) => {
    if (errors && errors.length) {
      return true
    }

    return this.props.areValuesChanged && !this.props.areValuesChanged(values)
  }

  onFieldsChange = (values, errors) => {
    this.setState({
      values,
      okDisabled: this.shouldDisableOk(values, errors),
    })
  }

  getModalButtonProps = () => {
    const {
      title,
      size,
      width,
      renderOpenTrigger,
      okButtonProps,
      onClose,
      fetching,
      visible,
      className,
    } = this.props

    okButtonProps.disabled = this.state.okDisabled

    return {
      title,
      size,
      width,
      renderOpenTrigger,
      okButtonProps,
      onOk: this.onOk,
      onClose,
      fetching,
      visible,
      className,
    }
  }

  getFormProps = () => ({
    fields: this.props.fields,
    onFieldsChange: this.onFieldsChange,
    validateOnMount: true,
    hideErrorsForUntouchedFields: true,
  })

  render = () => (
    <ModalButton {...this.getModalButtonProps()}>
      {this.props.text}
      <CustomForm {...this.getFormProps()} />
    </ModalButton>
  )
}

export {
  ModalFormButton,
}
