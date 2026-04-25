
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveLayoutId, setActiveTable } from '@/actions/prototypePage'
import { Dropdown } from '@/components/Dropdown'
import { DownOutlined } from '@/components/Icons/DownOutlined'
import { ErrorTriangleIcon } from '@/components/Icons/ErrorTriangleIcon'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { LongText } from '@/components/LongText'
import { MenuTrigger } from '@/components/Menu'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { Localization, localize } from '@/localization/i18n'
import { referenceLayoutShape } from '@/models/ReferenceLayout'
import { activeLayoutIdSelector } from '@/selectors/prototypePage'
import {
  DropdownButton,
  StyledMenu,
  StyledMenuItem,
  FailedLabel,
  MenuItemExtraWrapper,
  DeleteIconButton,
} from './LayoutsListDropdown.styles'

const LayoutsListDropdown = ({
  layoutsList,
  removeLayout,
}) => {
  const dispatch = useDispatch()

  const activeLayoutId = useSelector(activeLayoutIdSelector)

  const onDeleteIconClick = (e, id) => {
    e.stopPropagation()
    removeLayout(id)
  }

  const onLayoutClick = (id) => {
    dispatch(setActiveTable(null))
    dispatch(setActiveLayoutId(id))
  }

  const renderExtra = ({ id, state }) => (
    <MenuItemExtraWrapper>
      {
        state === ReferenceLayoutState.FAILED && (
          <FailedLabel>
            <ErrorTriangleIcon />
            {localize(Localization.FAILED)}
          </FailedLabel>
        )
      }
      <DeleteIconButton
        icon={<XMarkIcon />}
        onClick={(e) => onDeleteIconClick(e, id)}
      />
    </MenuItemExtraWrapper>
  )

  const renderDropdownMenu = () => {
    const layouts = layoutsList.map(({ id, title, state }) => (
      <StyledMenuItem
        key={id}
        $selected={activeLayoutId === id}
        onClick={() => onLayoutClick(id)}
      >
        <LongText
          text={title}
        />
        {
          renderExtra({
            id,
            state,
          })
        }
      </StyledMenuItem>
    ))

    return (
      <StyledMenu>
        {layouts}
      </StyledMenu>
    )
  }

  return (
    <Dropdown
      dropdownRender={renderDropdownMenu}
      trigger={MenuTrigger.CLICK}
    >
      <DropdownButton
        icon={<DownOutlined />}
      />
    </Dropdown>
  )
}

LayoutsListDropdown.propTypes = {
  layoutsList: PropTypes.arrayOf(referenceLayoutShape).isRequired,
  removeLayout: PropTypes.func.isRequired,
}

export {
  LayoutsListDropdown,
}
