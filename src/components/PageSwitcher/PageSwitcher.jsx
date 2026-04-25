
import PropTypes from 'prop-types'
import { Component } from 'react'
import { LeftIcon } from '@/components/Icons/LeftIcon'
import { RightIcon } from '@/components/Icons/RightIcon'
import {
  Switcher,
  Splitter,
  PagesQuantity,
  PaginationButton,
  SelectStyled,
} from './PageSwitcher.styles'

const dropdownStyles = {
  minWidth: 'fit-content',
}

class PageSwitcher extends Component {
  static propTypes = {
    className: PropTypes.string,
    pagesQuantity: PropTypes.number.isRequired,
    activePage: PropTypes.number,
    changeActivePage: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    pageOptions: PropTypes.arrayOf(PropTypes.element),
  }

  prevPage = () => {
    const { activePage, changeActivePage } = this.props
    changeActivePage(Number(activePage) - 1)
  }

  nextPage = () => {
    const { activePage, changeActivePage } = this.props
    changeActivePage(Number(activePage) + 1)
  }

  onSelectChange = (activePage) => {
    if (activePage !== this.props.activePage) {
      this.props.changeActivePage(activePage)
    }
  }

  render () {
    const { className, pagesQuantity, activePage, disabled, pageOptions } = this.props

    return (
      <Switcher className={className}>
        <PaginationButton
          disabled={activePage === 1}
          icon={<LeftIcon />}
          onClick={this.prevPage}
          shape="circle"
        />
        <SelectStyled
          dropdownStyle={dropdownStyles}
          getPopupContainer={(trigger) => trigger.parentNode}
          onChange={this.onSelectChange}
          optionFilterProp="children"
          value={activePage}
          virtual={false}
        >
          {pageOptions}
        </SelectStyled>
        <Splitter disabled={disabled}>/</Splitter>
        <PagesQuantity
          disabled={disabled}
        >
          {pagesQuantity}
        </PagesQuantity>
        <PaginationButton
          disabled={activePage === pagesQuantity}
          icon={<RightIcon />}
          onClick={this.nextPage}
          shape="circle"
        />
      </Switcher>
    )
  }
}

export {
  PageSwitcher,
}
