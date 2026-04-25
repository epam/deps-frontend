
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { LongText } from '@/components/LongText'
import { Menu, MenuTrigger } from '@/components/Menu'
import { sheetInfoShape } from '@/models/DocumentParsingInfo'
import { ArrowIcon, MenuItem } from './SheetsDropdown.styles'

const SheetsDropdown = ({
  sheets,
  setActiveSheet,
  activeSheet,
}) => {
  const renderDropdownMenu = () => (
    <Menu>
      {
        sheets.map((sheet) => (
          <MenuItem
            key={sheet.id}
            $selected={sheet.id === activeSheet.id}
            onClick={() => setActiveSheet(sheet)}
          >
            <LongText text={sheet.title} />
          </MenuItem>
        ))
      }
    </Menu>
  )

  return (
    <Dropdown
      dropdownRender={renderDropdownMenu}
      trigger={MenuTrigger.CLICK}
    >
      <Button.Secondary>
        {activeSheet.title}
        <ArrowIcon />
      </Button.Secondary>
    </Dropdown>
  )
}

SheetsDropdown.propTypes = {
  sheets: PropTypes.arrayOf(sheetInfoShape),
  setActiveSheet: PropTypes.func.isRequired,
  activeSheet: sheetInfoShape,
}

export {
  SheetsDropdown,
}
