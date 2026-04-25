
import PropTypes from 'prop-types'
import { Component } from 'react'
import { Tooltip } from '@/components/Tooltip'
import { StyledTag, Text } from './TagsInput.styles'

class Tag extends Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
    onClose: PropTypes.func,
  }

  onClose = () => this.props.onClose(this.props.tag)

  render = () => (
    <Tooltip title={this.props.tag}>
      <StyledTag
        closable
        onClose={this.onClose}
      >
        <Text>
          {this.props.tag}
        </Text>
      </StyledTag>
    </Tooltip>
  )
}

export {
  Tag,
}
