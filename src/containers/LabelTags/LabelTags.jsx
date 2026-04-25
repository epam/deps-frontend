
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { removeLabel } from '@/actions/documents'
import { LongText } from '@/components/LongText'
import { LABEL_TAG } from '@/constants/automation'
import { localize, Localization } from '@/localization/i18n'
import { labelShape } from '@/models/Label'
import { notifySuccess } from '@/utils/notification'
import { LabelTag, LabelName } from './LabelTags.styles'

class LabelTags extends Component {
  static propTypes = {
    labels: PropTypes.arrayOf(labelShape).isRequired,
    removeLabel: PropTypes.func.isRequired,
    isCommonTooltipShown: PropTypes.bool,
  }

  onLabelClose = async (labelId) => {
    try {
      await this.props.removeLabel(labelId)
      notifySuccess(localize(Localization.REMOVE_LABEL_SUCCESSFUL))
    } catch (e) {
      console.error(e)
    }
  }

  onClick = (e) => {
    e.stopPropagation()
  }

  render = () => (
    this.props.labels.map((item) => (
      <LabelTag
        key={item._id}
        closable
        data-automation={LABEL_TAG}
        onClick={this.onClick}
        onClose={() => this.onLabelClose(item._id)}
      >
        {
          this.props.isCommonTooltipShown
            ? <LabelName>{item.name}</LabelName>
            : <LongText text={item.name} />
        }
      </LabelTag>
    ))
  )
}

const mergeProps = (stateProps, { dispatch }, ownProps) => ({
  ...ownProps,
  ...stateProps,
  removeLabel: (label) => dispatch(removeLabel(label, ownProps.id)),
})

const ConnectedComponent = connect(null, null, mergeProps)(LabelTags)

export {
  ConnectedComponent as LabelTags,
}
