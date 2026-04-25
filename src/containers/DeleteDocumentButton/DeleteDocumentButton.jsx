
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { deleteDocuments } from '@/actions/documents'
import { Button, ButtonType } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { localize, Localization } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'

const confirm = Modal.confirm

class DeleteDocumentButton extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    deleteDocument: PropTypes.func,
  }

  showConfirm = () => {
    confirm({
      title: localize(Localization.DELETE_DOCUMENT_CONFIRM_TITLE),
      content: localize(Localization.DELETE_DOCUMENT_CONFIRM_CONTENT),
      okText: localize(Localization.DELETE),
      okType: ButtonType.DANGER,
      cancelText: localize(Localization.CANCEL),
      onOk: this.props.deleteDocument,
    })
  }

  render () {
    return (
      <Button.Text onClick={this.showConfirm}>{this.props.children}</Button.Text>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  deleteDocument: async () => {
    await dispatch(deleteDocuments([ownProps.documentId]))
    goTo(navigationMap.documents())
  },
})

const ConnectedComponent = connect(null, mapDispatchToProps)(DeleteDocumentButton)

export {
  ConnectedComponent as DeleteDocumentButton,
}
