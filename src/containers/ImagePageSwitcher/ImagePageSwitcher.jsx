
import PropTypes from 'prop-types'
import { CustomSelect } from '@/components/Select'
import { CenteredPageSwitcher, OptionContent } from './ImagePageSwitcher.styles'

const { Option } = CustomSelect

const ImagePageSwitcher = ({
  className,
  disabled,
  pagesQuantity,
  onChangeActivePage,
  activePage,
}) => {
  const createPageOptions = () => {
    const selectItems = []
    let page = 1

    while (page <= pagesQuantity) {
      selectItems.push(
        <Option
          key={page}
          value={page}
        >
          <OptionContent>
            {page}
          </OptionContent>
        </Option>,
      )
      page++
    }

    return selectItems
  }

  return (
    <CenteredPageSwitcher
      activePage={activePage}
      changeActivePage={onChangeActivePage}
      className={className}
      disabled={disabled}
      pageOptions={createPageOptions()}
      pagesQuantity={pagesQuantity}
    />
  )
}

ImagePageSwitcher.propTypes = {
  className: PropTypes.string,
  activePage: PropTypes.number.isRequired,
  onChangeActivePage: PropTypes.func.isRequired,
  pagesQuantity: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
}

export {
  ImagePageSwitcher,
}
