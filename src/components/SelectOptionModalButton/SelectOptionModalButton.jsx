
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { Button } from '@/components/Button'
import { ModalFormButton } from '@/components/ModalFormButton'
import { PreviewAutocomplete } from '@/components/PreviewAutocomplete'
import { optionShape } from '@/components/Select'

class SelectOptionModalButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    emptySearchText: PropTypes.string.isRequired,
    onSave: PropTypes.func,
    children: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(optionShape).isRequired,
    saveButtonText: PropTypes.string,
    disabled: PropTypes.bool,
    fetching: PropTypes.bool,
    className: PropTypes.string,
  }

  onOk = ({ option }) => {
    this.props.onSave && this.props.onSave(option)
  }

  areValuesChanged = (values) => !!values?.option

  renderOpenButton = (open) => (
    <Button.Text
      disabled={this.props.disabled}
      onClick={open}
    >
      {this.props.children}
    </Button.Text>
  )

  render = () => {
    const fields = {
      option: {
        render: () => (
          <PreviewAutocomplete
            dataSource={this.props.options}
            emptySearchText={this.props.emptySearchText}
            fetching={this.props.fetching}
            placeholder={this.props.placeholder}
          />
        ),
      },
    }

    const saveButtonProps = {
      text: this.props.saveButtonText,
    }

    return (
      <ModalFormButton
        areValuesChanged={this.areValuesChanged}
        className={this.props.className}
        fields={fields}
        okButtonProps={saveButtonProps}
        onOk={this.onOk}
        renderOpenTrigger={this.renderOpenButton}
        title={this.props.title}
      />
    )
  }
}

export {
  SelectOptionModalButton,
}
