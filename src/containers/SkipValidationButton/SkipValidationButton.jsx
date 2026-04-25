
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { skipValidation } from '@/actions/documentReviewPage'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { localize, Localization } from '@/localization/i18n'
import { notifySuccess } from '@/utils/notification'

const confirm = Modal.confirm

class SkipValidationButton extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    // disabled: PropTypes.bool.isRequired,
    skipValidation: PropTypes.func,
  }

  skipValidation = async () => {
    try {
      await this.props.skipValidation()
      notifySuccess(localize(Localization.SKIP_VALIDATION_SUCCESSFUL))
    } catch (e) {
      console.error(e)
    }
  }

  showConfirm = () => {
    confirm({
      title: localize(Localization.SKIP_VALIDATION_CONFIRM_TITLE),
      okText: localize(Localization.SKIP_VALIDATION),
      cancelText: localize(Localization.CANCEL),
      onOk: this.skipValidation,
    })
  }

  render () {
    return (
      <Button.Text
        disabled
        onClick={this.showConfirm}
      >
        {this.props.children}
      </Button.Text>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  skipValidation: () => dispatch(skipValidation(ownProps.documentId, ownProps.extractedData)),
})

const ConnectedComponent = connect(null, mapDispatchToProps)(SkipValidationButton)

export {
  ConnectedComponent as SkipValidationButton,
}
