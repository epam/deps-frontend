
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveFieldTypes } from '@/actions/documentReviewPage'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { DateFieldIcon } from '@/components/Icons/DateFieldIcon'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { KeyValuePairFieldIcon } from '@/components/Icons/KeyValuePairFieldIcon'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { TableFieldIcon } from '@/components/Icons/TableFieldIcon'
import { MenuTrigger } from '@/components/Menu'
import { Switch } from '@/components/Switch'
import { ACTIVE_FIELD_TYPES as INITIAL_ACTIVE_FIELD_TYPES } from '@/constants/field'
import { ComponentSize } from '@/enums/ComponentSize'
import { FieldType, RESOURCE_FIELDS_TYPES } from '@/enums/FieldType'
import { localize, Localization } from '@/localization/i18n'
import { activeFieldTypesSelector } from '@/selectors/documentReviewPage'
import { theme } from '@/theme/theme.default'
import { EnableAllDropdownItem } from './EnableAllDropdownItem'
import {
  MenuItem,
  DropdownMenu,
  FieldTypeItem,
  Trigger,
} from './FieldTypeFilterDropdown.styles'

const ENABLE_ALL = localize(Localization.ENABLE_ALL)
const FIELD_TYPE_TO_ICON_MAPPER = {
  [FieldType.CHECKMARK]: <CheckboxFieldIcon />,
  [FieldType.STRING]: <StringFieldIcon />,
  [FieldType.DICTIONARY]: <KeyValuePairFieldIcon />,
  [FieldType.TABLE]: <TableFieldIcon />,
  [FieldType.ENUM]: <EnumFieldIcon />,
  [FieldType.DATE]: <DateFieldIcon />,
}

const FieldTypeFilterDropdown = ({
  getPopupContainer,
}) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const activeFieldTypes = useSelector(activeFieldTypesSelector)

  const handleToggle = (isActive, fieldType) => {
    const newActiveFieldTypes = isActive
      ? [...activeFieldTypes, fieldType]
      : activeFieldTypes.filter((type) => type !== fieldType)
    dispatch(setActiveFieldTypes(newActiveFieldTypes))
  }

  const handleToggleAll = (isActive) => {
    const newActiveFieldTypes = isActive ? INITIAL_ACTIVE_FIELD_TYPES : []
    dispatch(setActiveFieldTypes(newActiveFieldTypes))
  }

  const isEnableAllToggleChecked = INITIAL_ACTIVE_FIELD_TYPES.length === activeFieldTypes.length
  const isEnableAllToggleIndeterminate = !isEnableAllToggleChecked && !!activeFieldTypes.length

  const renderDropdownMenu = () => (
    <DropdownMenu>
      <MenuItem key={ENABLE_ALL}>
        <EnableAllDropdownItem
          checked={isEnableAllToggleChecked}
          indeterminate={isEnableAllToggleIndeterminate}
          onChange={handleToggleAll}
        />
      </MenuItem>
      {
        INITIAL_ACTIVE_FIELD_TYPES.map((type) => (
          <MenuItem key={type}>
            <FieldTypeItem>
              {FIELD_TYPE_TO_ICON_MAPPER[type]}
              {RESOURCE_FIELDS_TYPES[type]}
            </FieldTypeItem>
            <Switch
              checked={activeFieldTypes.includes(type)}
              onChange={(flag) => handleToggle(flag, type)}
              size={ComponentSize.SMALL}
            />
          </MenuItem>
        ))
      }
    </DropdownMenu>
  )

  const getDropdownContainerNode = (trigger) => trigger

  return (
    <Dropdown
      dropdownRender={renderDropdownMenu}
      getPopupContainer={getPopupContainer || getDropdownContainerNode}
      onOpenChange={setVisible}
      open={visible}
      trigger={MenuTrigger.CLICK}
    >
      <Trigger>
        <Badge
          color={theme.color.error}
          dot={!isEnableAllToggleChecked}
          size={ComponentSize.SMALL}
        >
          <Button.Secondary>
            {localize(Localization.FIELD_TYPE)}
          </Button.Secondary>
        </Badge>
      </Trigger>
    </Dropdown>
  )
}

FieldTypeFilterDropdown.propTypes = {
  getPopupContainer: PropTypes.func,
}

export {
  FieldTypeFilterDropdown,
}
