
import PropTypes from 'prop-types'
import { Component } from 'react'
import { SearchIcon } from '@/components/Icons/SearchIcon'
import { Input } from '@/components/Input'
import { LongText } from '@/components/LongText'
import { optionShape } from '@/components/Select'
import { Spin } from '@/components/Spin'
import {
  PREVIEW_AUTOCOMPLETE,
  AUTOCOMPLETE_LIST,
  ADD_LABELS_MODAL_SEARCH_INPUT,
} from '@/constants/automation'
import { ListItem, List } from './PreviewAutocomplete.styles'

class PreviewAutocomplete extends Component {
  static propTypes = {
    dataSource: PropTypes.arrayOf(optionShape).isRequired,
    placeholder: PropTypes.string,
    emptySearchText: PropTypes.string,
    fetching: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    fetching: false,
  }

  state = {
    searchString: '',
    selectedItem: '',
    dataSource: this.props.dataSource,
  }

  onChangeSearchString = (e) => {
    const value = e.target.value
    const dataSource = this.props.dataSource.filter((item) => item.text.toLowerCase().indexOf(value.toLowerCase()) !== -1)

    this.setState({
      searchString: value,
      dataSource,
      selectedItem: '',
    })

    if (this.props.onChange) {
      this.props.onChange(null)
    }
  }

  onSelectValue = (text, value, disabled) => {
    if (disabled) {
      return
    }

    this.setState({
      searchString: text,
      selectedItem: value,
    })
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  render = () => {
    const { searchString, dataSource, selectedItem } = this.state
    const { fetching, placeholder, emptySearchText } = this.props

    return (
      <div data-automation={PREVIEW_AUTOCOMPLETE}>
        <Spin spinning={fetching}>
          <Input
            addonAfter={<SearchIcon />}
            data-automation={ADD_LABELS_MODAL_SEARCH_INPUT}
            onChange={this.onChangeSearchString}
            placeholder={placeholder}
            value={searchString}
          />
          <List data-automation={AUTOCOMPLETE_LIST}>
            {
              dataSource.map((item) => (
                <ListItem
                  key={item.value}
                  $active={item.value === selectedItem}
                  disabled={item.disabled}
                  onClick={
                    () => {
                      this.onSelectValue(item.text, item.value, item.disabled)
                    }
                  }
                >
                  <LongText text={item.text} />
                </ListItem>
              ))
            }
            {dataSource.length === 0 && emptySearchText && <ListItem>{emptySearchText}</ListItem>}
          </List>
        </Spin>
      </div>
    )
  }
}

export {
  PreviewAutocomplete,
}
