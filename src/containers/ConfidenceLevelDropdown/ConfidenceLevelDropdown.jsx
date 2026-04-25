
import PropTypes from 'prop-types'
import { useState } from 'react'
import { connect } from 'react-redux'
import { updateConfidenceView } from '@/actions/documentReviewPage'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { MenuTrigger } from '@/components/Menu'
import { Switch } from '@/components/Switch'
import { ComponentSize } from '@/enums/ComponentSize'
import { ConfidenceLevel } from '@/enums/ConfidenceLevel'
import { localize, Localization } from '@/localization/i18n'
import { confidenceViewShape } from '@/models/confidenceView'
import { confidenceViewSelector } from '@/selectors/documentReviewPage'
import { theme } from '@/theme/theme.default'
import {
  MenuItem,
  DropdownMenu,
  InfoWrapper,
  InfoIcon,
  Trigger,
} from './ConfidenceLevelDropdown.styles'
import { ConfidenceLevelRangeHint } from './ConfidenceLevelRangeHint'
import { EnableAllDropdownItem } from './EnableAllDropdownItem'

const ENABLE_ALL = localize(Localization.ENABLE_ALL)

const getConfidenceLevelInfoItem = () => (
  <InfoWrapper>
    <InfoIcon />
    {localize(Localization.CONFIDENCE_LEVEL_INFO)}
  </InfoWrapper>
)

const ConfidenceLevelDropdown = ({
  disabled,
  confidenceView,
  updateConfidenceView,
  getPopupContainer,
}) => {
  const [visible, setVisible] = useState(false)

  const onConfidenceSwitchChange = (flag, conf) => {
    updateConfidenceView({
      [conf]: flag,
    })
  }

  const onConfidenceAllSwitchChange = (flag) => {
    updateConfidenceView({
      ...Object.values(ConfidenceLevel).reduce((acc, c) => ({
        ...acc,
        [c]: flag,
      }), {}),
    })
  }

  const isEnableAllToggleChecked = Object.values(confidenceView).every((conf) => !!conf)
  const isEnableAllToggleIndeterminate = !isEnableAllToggleChecked && (
    Object.values(confidenceView).some((conf) => !!conf)
  )

  const renderConfidenceDropdownMenu = () => (
    <DropdownMenu>
      {getConfidenceLevelInfoItem()}
      <MenuItem key={ENABLE_ALL}>
        <EnableAllDropdownItem
          checked={isEnableAllToggleChecked}
          indeterminate={isEnableAllToggleIndeterminate}
          onChange={onConfidenceAllSwitchChange}
        />
      </MenuItem>
      {
        Object.values(ConfidenceLevel).map((conf) => (
          <MenuItem key={conf}>
            <ConfidenceLevelRangeHint
              confidenceLevel={conf}
            />
            <Switch
              checked={confidenceView?.[conf]}
              onChange={(flag) => onConfidenceSwitchChange(flag, conf)}
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
      dropdownRender={renderConfidenceDropdownMenu}
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
          <Button.Secondary disabled={disabled}>
            {localize(Localization.CONFIDENCE_LEVEL)}
          </Button.Secondary>
        </Badge>
      </Trigger>
    </Dropdown>
  )
}

ConfidenceLevelDropdown.propTypes = {
  updateConfidenceView: PropTypes.func.isRequired,
  confidenceView: confidenceViewShape.isRequired,
  getPopupContainer: PropTypes.func,
  disabled: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  confidenceView: confidenceViewSelector(state),
})

const mapDispatchToProps = {
  updateConfidenceView,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(ConfidenceLevelDropdown)

export {
  ConnectedComponent as ConfidenceLevelDropdown,
}
