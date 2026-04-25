
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setFilters } from '@/actions/navigation'
import { Switch } from '@/components/Switch/Switch'
import { FileFilterKey } from '@/constants/navigation'
import { ComponentSize } from '@/enums/ComponentSize'
import { Localization, localize } from '@/localization/i18n'
import { ToggleContainer, ToggleLabel } from './AvailableFilesToggle.styles'

export const AvailableFilesToggle = ({ filterConfig }) => {
  const dispatch = useDispatch()
  const referenceAvailable = filterConfig[FileFilterKey.REFERENCE_AVAILABLE]

  const handleToggle = () => {
    dispatch(setFilters({
      ...filterConfig,
      [FileFilterKey.REFERENCE_AVAILABLE]: !referenceAvailable,
    }))
  }

  return (
    <ToggleContainer>
      <ToggleLabel
        onClick={handleToggle}
      >
        {localize(Localization.ONLY_AVAILABLE_FILES)}
      </ToggleLabel>
      <Switch
        checked={referenceAvailable}
        onChange={handleToggle}
        size={ComponentSize.SMALL}
      />
    </ToggleContainer>
  )
}

AvailableFilesToggle.propTypes = {
  filterConfig: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
    referenceAvailable: PropTypes.bool,
  }),
}
