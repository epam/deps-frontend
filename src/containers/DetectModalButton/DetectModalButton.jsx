
import PropTypes from 'prop-types'
import { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { Button } from '@/components/Button'
import { UiKeys } from '@/constants/navigation'
import { RegionAreaPicker } from '@/containers/RegionAreaPicker'
import { localize, Localization } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { documentSelector } from '@/selectors/documentReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { isTableDataDetectingSelector } from '@/selectors/requests'

const mapStateToProps = (state) => ({
  message: localize(Localization.EXTRACT_TABLE_MESSAGE),
  imageUrl: Document.getPreviewUrl(documentSelector(state), uiSelector(state)[UiKeys.ACTIVE_PAGE] || 1),
  fetching: isTableDataDetectingSelector(state),
})

const ConnectedRegionPicker = connect(mapStateToProps)(RegionAreaPicker)

class DetectModalButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
  }

  state = {
    visible: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  hideModal = () => {
    this.setState({
      visible: false,
    })
  }

  onOk = (tableCoordinates) => {
    this.hideModal()
    this.props.onOk && this.props.onOk(tableCoordinates)
  }

  renderTablePicker = () => {
    if (!this.state.visible) return null

    return (
      <ConnectedRegionPicker
        message={this.props.message}
        onCancel={this.hideModal}
        onOk={this.onOk}
        title={this.props.title}
      />
    )
  }

  render = () => (
    <Fragment>
      <Button.Text
        className={this.props.className}
        disabled={this.props.disabled}
        onClick={this.showModal}
      >
        {this.props.title}
      </Button.Text>
      {this.renderTablePicker()}
    </Fragment>
  )
}

export {
  DetectModalButton,
}
