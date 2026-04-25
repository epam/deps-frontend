
import PropTypes from 'prop-types'
import { useState } from 'react'
import { deleteOutputProfile } from '@/api/outputProfilesApi'
import { DeleteIconFilled } from '@/components/Icons/DeleteIconFilled'
import { TableActionIcon } from '@/components/TableActionIcon'
import { Localization, localize } from '@/localization/i18n'
import { OutputProfile, outputProfileShape } from '@/models/OutputProfile'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const DeleteOutputProfileButton = ({
  isDeletionAllowed,
  profile,
  documentTypeId,
  onAfterDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const getTooltip = () => {
    if (isPlugin) {
      return localize(Localization.OUTPUT_PROFILE_DELETION_IS_NOT_ALLOWED_PLUGINS)
    }

    return isDeletionAllowed
      ? localize(Localization.DELETE_PROFILE)
      : localize(Localization.OUTPUT_PROFILE_DELETION_IS_NOT_ALLOWED)
  }

  const isPlugin = OutputProfile.isPlugin(profile)

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await deleteOutputProfile(
        documentTypeId,
        profile.id,
      )
      notifySuccess(localize(Localization.OUTPUT_PROFILE_DELETE_SUCCESS_STATUS))
      await onAfterDelete()
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TableActionIcon
      disabled={!isDeletionAllowed || isLoading || isPlugin}
      icon={<DeleteIconFilled />}
      onClick={onDelete}
      tooltip={
        {
          title: getTooltip(),
        }
      }
    />
  )
}

DeleteOutputProfileButton.propTypes = {
  documentTypeId: PropTypes.string.isRequired,
  isDeletionAllowed: PropTypes.bool.isRequired,
  profile: outputProfileShape.isRequired,
  onAfterDelete: PropTypes.func.isRequired,
}

export {
  DeleteOutputProfileButton,
}
