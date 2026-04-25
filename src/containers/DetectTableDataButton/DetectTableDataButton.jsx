
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { detectTableData } from '@/actions/documentReviewPage'
import { DetectModalButton as ModalButton } from '@/containers/DetectModalButton'
import { localize, Localization } from '@/localization/i18n'
import { notifyRequest, notifySuccess, notifyInfo } from '@/utils/notification'

class DetectTableDataButton extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    children: PropTypes.string.isRequired,
    detectTableData: PropTypes.func.isRequired,
  }

  detectTableData = async (region) => {
    if (!region) {
      return
    }

    const tableFields = await notifyRequest(this.props.detectTableData(region))({
      fetching: localize(Localization.FETCHING_EXTRACT_TABLE_DATA),
      warning: localize(Localization.EXTRACT_TABLE_DATA_FAILED),
    })

    if (tableFields?.length) {
      notifySuccess(localize(Localization.EXTRACT_TABLE_DATA_SUCCESSFUL))
    } else {
      notifyInfo(localize(Localization.EXTRACT_EMPTY_TABLE_DATA))
    }
  }

  render = () => (
    <ModalButton
      disabled={this.props.disabled}
      message={localize(Localization.DETECT_TABLE_MESSAGE)}
      onOk={this.detectTableData}
      title={this.props.children}
    />
  )
}

const ConnectedComponent = connect(null, {
  detectTableData,
})(DetectTableDataButton)

export {
  ConnectedComponent as DetectTableDataButton,
}
