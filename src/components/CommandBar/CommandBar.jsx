
import PropTypes from 'prop-types'
import {
  useRef,
  useCallback,
  useState,
} from 'react'
import { Button } from '@/components/Button'
import { MoreIcon } from '@/components/Icons/MoreIcon'
import { MenuTrigger } from '@/components/Menu'
import { CustomMenu } from '@/components/Menu/CustomMenu'
import { COMMAND_BAR, MORE_OPTIONS_BUTTON } from '@/constants/automation'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import {
  CommandBar as CommandBarWrapper,
  Command,
  CommandsSeparator,
} from './CommandBar.styles'

const MORE_OPTIONS_TOOLTIP = {
  placement: Placement.TOP,
  title: localize(Localization.MORE_OPTIONS),
}

const CommandBar = ({
  commands,
  disabled,
  customSize,
  getPopupContainer,
  className,
}) => {
  const componentRef = useRef()
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false)

  const renderCommandsAsMenuItems = useCallback((commands) => (
    commands.map((item) => ({
      content: () => (
        item.renderComponent()
      ),
    }),
    )), [])

  const getContainer = useCallback((trigger) => trigger.parentNode, [])

  const checkVisibility = (visible) => visible ? visible() : true

  const visibleCommands = commands.filter((command) => !command.hidden)
  const hiddenCommands = commands.filter((command) => command.hidden)

  return (
    <CommandBarWrapper
      ref={componentRef}
      className={className}
      data-automation={COMMAND_BAR}
    >
      {
        visibleCommands.map((command, index) => {
          const isVisible = checkVisibility(command.visible)

          return isVisible && (
            <Command
              key={index}
              onClick={command.onClick}
            >
              {command.renderComponent()}
            </Command>
          )
        })
      }
      {
        visibleCommands.length > 0 && hiddenCommands.length > 0 && (
          <CommandsSeparator />
        )
      }
      {
        hiddenCommands.length > 0 && (
          <CustomMenu
            disabled={disabled}
            getPopupContainer={getPopupContainer || getContainer}
            items={isDropdownExpanded ? renderCommandsAsMenuItems(hiddenCommands) : []}
            onVisibleChange={setIsDropdownExpanded}
            trigger={MenuTrigger.CLICK}
          >
            <Button.Icon
              customSize={customSize}
              data-automation={MORE_OPTIONS_BUTTON}
              icon={<MoreIcon />}
              tooltip={MORE_OPTIONS_TOOLTIP}
            />
          </CustomMenu>
        )
      }
    </CommandBarWrapper>
  )
}

CommandBar.propTypes = {
  commands: PropTypes.arrayOf(
    PropTypes.shape({
      renderComponent: PropTypes.func.isRequired,
      onClick: PropTypes.func,
      hidden: PropTypes.bool,
      visible: PropTypes.func,
    }),
  ).isRequired,
  disabled: PropTypes.bool,
  customSize: PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string,
  }),
  getPopupContainer: PropTypes.func,
  className: PropTypes.string,
}

export {
  CommandBar,
}
