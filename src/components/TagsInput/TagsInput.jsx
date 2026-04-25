
import PropTypes from 'prop-types'
import { Component, Fragment } from 'react'
import { Input } from '@/components/Input'
import { Tag } from './Tag'

class TagsInput extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
  }

  state = {
    inputValue: '',
  }

  handleClose = (removedTag) => this.props.onChange(this.props.value.filter((tag) => tag !== removedTag))

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    let { value } = this.props

    if (this.state.inputValue && !value.includes(this.state.inputValue)) {
      value = [...value, this.state.inputValue]
    }

    this.props.onChange(value)
    this.setState({
      inputValue: '',
    })
  }

  renderTags = (value) => value.map((tag) => (
    <Tag
      key={tag}
      onClose={this.handleClose}
      tag={tag}
    />
  ))

  render = () => {
    const { value, placeholder } = this.props

    return (
      <Fragment>
        <Input
          onBlur={this.handleInputConfirm}
          onChange={this.handleInputChange}
          onPressEnter={this.handleInputConfirm}
          placeholder={placeholder}
          value={this.state.inputValue}
        />
        {this.renderTags(value)}
      </Fragment>
    )
  }
}

export {
  TagsInput,
}
