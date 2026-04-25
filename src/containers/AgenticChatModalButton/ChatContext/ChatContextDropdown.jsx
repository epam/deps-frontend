
import PropTypes from 'prop-types'
import {
  useCallback,
  useRef,
  useState,
} from 'react'
import { Dropdown } from '@/components/Dropdown'
import { LongText } from '@/components/LongText'
import { MenuTrigger } from '@/components/Menu'
import { Tooltip } from '@/components/Tooltip'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import {
  Button,
  CheckIcon,
  List,
  ListItem,
  PlusIcon,
} from './ChatContextDropdown.styles'

const ChatContextDropdown = ({
  disabled,
  onToolSelect,
  toolsList,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const buttonRef = useRef(null)

  const toggleDropdown = useCallback(() => setIsDropdownVisible((visible) => !visible), [setIsDropdownVisible])

  const onClick = useCallback(() => {
    if (isDropdownVisible) {
      buttonRef.current.blur()
    }

    toggleDropdown()
  }, [isDropdownVisible, toggleDropdown])

  const renderTrigger = useCallback(() => {
    const Trigger = (
      <Button
        ref={buttonRef}
        onClick={onClick}
      >
        <PlusIcon />
      </Button>
    )

    return disabled
      ? Trigger
      : (
        <Tooltip title={localize(Localization.ADD_CONTEXT)}>
          {Trigger}
        </Tooltip>
      )
  }, [onClick, disabled])

  const renderDropdownContent = useCallback(() => (
    <List>
      {
        toolsList.map(({ id, name, isSelected }) => (
          <ListItem
            key={id}
            onClick={() => onToolSelect(id)}
          >
            <LongText text={name} />
            {isSelected && <CheckIcon />}
          </ListItem>
        ))
      }
    </List>
  ), [onToolSelect, toolsList])

  return (
    <Dropdown
      disabled={disabled}
      dropdownRender={renderDropdownContent}
      onOpenChange={setIsDropdownVisible}
      open={isDropdownVisible}
      placement={Placement.TOP_LEFT}
      trigger={MenuTrigger.CLICK}
    >
      {renderTrigger()}
    </Dropdown>
  )
}

ChatContextDropdown.propTypes = {
  disabled: PropTypes.bool,
  onToolSelect: PropTypes.func.isRequired,
  toolsList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    name: PropTypes.string.isRequired,
  })),
}

export {
  ChatContextDropdown,
}
