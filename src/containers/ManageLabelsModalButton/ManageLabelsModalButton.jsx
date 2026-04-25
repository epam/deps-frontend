
import PropTypes from 'prop-types'
import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { addLabel } from '@/actions/documents'
import { createLabel, fetchLabels } from '@/actions/labels'
import { Button, ButtonType } from '@/components/Button'
import { LoadingIcon } from '@/components/Icons/LoadingIcon'
import { TagIcon } from '@/components/Icons/TagIcon'
import { Input } from '@/components/Input'
import { Modal } from '@/components/Modal'
import { PreviewAutocomplete } from '@/components/PreviewAutocomplete'
import { Tooltip } from '@/components/Tooltip'
import {
  ADD_NEW_LABEL_INPUT,
  ADD_NEW_LABEL_MODAL_BUTTON,
  ADD_LABELS_MODAL_CANCEL_BUTTON,
  ADD_LABELS_MODAL_SUBMIT_BUTTON,
  ADD_LABEL_BUTTON,
} from '@/constants/automation'
import { localize, Localization } from '@/localization/i18n'
import { Label, labelShape } from '@/models/Label'
import { labelsSelector } from '@/selectors/labels'
import {
  areLabelsFetchingSelector,
  isLabelCreatingSelector,
  isLabelAddingSelector,
} from '@/selectors/requests'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { InputLabelGroup } from './ManageLabelsModalButton.styles'

const MODAL_Z_INDEX = 1002

class ManageLabelsModalButton extends Component {
  static propTypes = {
    fetching: PropTypes.bool,
    isLabelCreating: PropTypes.bool,
    isLabelAdding: PropTypes.bool,
    addLabel: PropTypes.func.isRequired,
    createLabel: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    labels: PropTypes.arrayOf(labelShape),
    renderTrigger: PropTypes.func,
    onSubmit: PropTypes.func,
    title: PropTypes.string,
    documentIds: PropTypes.arrayOf(PropTypes.string),
    fetchLabels: PropTypes.func.isRequired,
  }

  state = {
    isLabelModalVisible: false,
    label: null,
    newLabel: null,
  }

  componentDidMount = () => {
    !this.props.labels.length && this.props.fetchLabels()
  }

  showLabelModal = () => {
    this.setState({
      isLabelModalVisible: true,
    })
  }

  handleAddLabel = async (label) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(label)
      return
    }

    await this.props.addLabel(label._id, this.props.documentIds)
    notifySuccess(localize(Localization.ADD_LABEL_SUCCESSFUL))
  }

  handleOk = async () => {
    try {
      const labelToAdd = this.props.labels.find((l) => l._id === this.state.label)
      labelToAdd && await this.handleAddLabel(labelToAdd)
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      this.setState({
        isLabelModalVisible: false,
        label: null,
        newLabel: null,
      })
    }
  }

  handleAddNewLabel = async () => {
    try {
      const newLabel = await this.props.createLabel(this.state.newLabel)
      newLabel && await this.handleAddLabel(newLabel)
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      this.setState({
        isLabelModalVisible: false,
        label: null,
        newLabel: null,
      })
    }
  }

  handleCancel = () => {
    this.setState({
      isLabelModalVisible: false,
      label: null,
      newLabel: null,
    })
  }

  onSelectLabel = (selectedLabel) => {
    this.setState({
      label: selectedLabel,
    })
  }

  onChangeNewLabelInput = (e) => {
    this.setState({
      newLabel: e.target.value,
    })
  }

  renderInputForNewLabel = () => {
    const { newLabel } = this.state
    return (
      <InputLabelGroup key="newLabel">
        <Input
          data-automation={ADD_NEW_LABEL_INPUT}
          onChange={this.onChangeNewLabelInput}
          placeholder={localize(Localization.NEW_LABEL_PLACEHOLDER)}
          value={newLabel}
        />
        <Button
          data-automation={ADD_NEW_LABEL_MODAL_BUTTON}
          disabled={!newLabel || this.props.isLabelCreating || this.props.isLabelAdding}
          onClick={this.handleAddNewLabel}
        >
          {this.props.isLabelCreating && <LoadingIcon />}
          {localize(Localization.ADD_NEW_LABEL)}
        </Button>
      </InputLabelGroup>
    )
  }

  getTriggerButton = () => {
    if (this.props.renderTrigger) {
      return this.props.renderTrigger(this.showLabelModal)
    }

    return (
      <Tooltip title={localize(Localization.MANAGE_LABELS)}>
        <Button.Secondary
          data-automation={ADD_LABEL_BUTTON}
          disabled={this.props.disabled}
          icon={<TagIcon />}
          onClick={this.showLabelModal}
        />
      </Tooltip>
    )
  }

  renderActionButtons = () => (
    <Fragment key={'actionButtons'}>
      <Button
        data-automation={ADD_LABELS_MODAL_CANCEL_BUTTON}
        onClick={this.handleCancel}
      >
        {localize(Localization.CANCEL)}
      </Button>
      <Button
        data-automation={ADD_LABELS_MODAL_SUBMIT_BUTTON}
        disabled={!this.state.label || this.props.isLabelAdding || this.props.isLabelCreating}
        onClick={this.handleOk}
        type={ButtonType.PRIMARY}
      >
        {this.props.isLabelAdding && <LoadingIcon />}
        {localize(Localization.CONFIRM)}
      </Button>
    </Fragment>
  )

  render () {
    const { fetching, labels } = this.props

    return (
      <Fragment>
        {this.getTriggerButton()}
        {
          this.state.isLabelModalVisible && (
            <Modal
              centered
              footer={
                [
                  this.renderInputForNewLabel(),
                  this.renderActionButtons(),
                ]
              }
              onCancel={this.handleCancel}
              onOk={this.handleOk}
              open={this.state.isLabelModalVisible}
              title={this.props.title ?? localize(Localization.SELECT_LABEL_TITLE)}
              zIndex={MODAL_Z_INDEX}
            >
              <PreviewAutocomplete
                dataSource={labels.map(Label.toOption)}
                emptySearchText={localize(Localization.LABEL_NOT_FOUND)}
                fetching={fetching}
                onChange={this.onSelectLabel}
                placeholder={localize(Localization.SEARCH_LABEL_PLACEHOLDER)}
              />
            </Modal>
          )
        }
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  fetching: areLabelsFetchingSelector(state),
  isLabelCreating: isLabelCreatingSelector(state),
  isLabelAdding: isLabelAddingSelector(state),
  labels: labelsSelector(state),
})

const mapDispatchToProps = {
  addLabel,
  createLabel,
  fetchLabels,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(ManageLabelsModalButton)

export {
  ConnectedComponent as ManageLabelsModalButton,
}
