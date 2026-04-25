
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { PageNavigationHeader } from '@/containers/PageNavigationHeader'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { EditButton, Controls } from './PrototypeHeader.styles'

const PrototypeHeader = ({
  isEditMode,
  isSavingDisabled,
  onCancel,
  onEdit,
  onSave,
  prototypeName,
  prototypeId,
}) => {
  const renderExtra = () => {
    if (isEditMode) {
      return (
        <Controls
          isSavingDisabled={isSavingDisabled}
          onCancel={onCancel}
          onSave={onSave}
        />
      )
    }

    return (
      <EditButton
        onClick={onEdit}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.EDIT)}
      </EditButton>
    )
  }

  return (
    <PageNavigationHeader
      parentPath={navigationMap.documentTypes.documentType(prototypeId)}
      renderExtra={renderExtra}
      title={prototypeName}
    />
  )
}

PrototypeHeader.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  isSavingDisabled: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  prototypeName: PropTypes.string.isRequired,
  prototypeId: PropTypes.string.isRequired,
}

export {
  PrototypeHeader,
}
