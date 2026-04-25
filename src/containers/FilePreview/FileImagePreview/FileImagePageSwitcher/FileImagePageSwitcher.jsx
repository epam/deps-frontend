
import PropTypes from 'prop-types'
import { CustomSelect } from '@/components/Select'
import { CenteredPageSwitcher, OptionContent } from './FileImagePageSwitcher.styles'

const { Option } = CustomSelect

const createPageOptions = (pagesQuantity) => {
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

const FileImagePageSwitcher = ({
  className,
  disabled,
  pagesQuantity,
  onChangeActivePage,
  activePage,
}) => {
  return (
    <CenteredPageSwitcher
      activePage={activePage}
      changeActivePage={onChangeActivePage}
      className={className}
      disabled={disabled}
      pageOptions={createPageOptions(pagesQuantity)}
      pagesQuantity={pagesQuantity}
    />
  )
}

FileImagePageSwitcher.propTypes = {
  className: PropTypes.string,
  activePage: PropTypes.number.isRequired,
  onChangeActivePage: PropTypes.func.isRequired,
  pagesQuantity: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
}

export {
  FileImagePageSwitcher,
}
