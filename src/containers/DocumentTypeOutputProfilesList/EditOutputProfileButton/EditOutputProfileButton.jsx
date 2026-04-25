
import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { updateOutputProfile } from '@/api/outputProfilesApi'
import { PenIcon } from '@/components/Icons/PenIcon'
import { OutputProfileByExtractorDrawer } from '@/containers/OutputProfileByExtractorDrawer'
import { OutputProfileByLayoutDrawer } from '@/containers/OutputProfileByLayoutDrawer'
import { OutputProfileType } from '@/enums/OutputProfileType'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { OutputProfile, outputProfileShape } from '@/models/OutputProfile'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { ActionIcon } from './EditOutputProfileButton.styles'

const TEST_ID = {
  EDIT_BUTTON: 'edit-profile-button',
}

const EditOutputProfileButton = ({
  documentType,
  profile,
  onAfterEditing,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateProfile = useCallback(async ({
    name,
    schema,
    format,
  }) => {
    try {
      setIsUpdating(true)
      await updateOutputProfile(
        documentType.code,
        profile.id,
        {
          name,
          schema,
          format,
        },
      )
      notifySuccess(localize(Localization.OUTPUT_PROFILE_UPDATE_SUCCESS_STATUS))
      setIsDrawerVisible(false)
      await onAfterEditing()
    } catch (e) {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsUpdating(false)
    }
  }, [
    documentType.code,
    profile.id,
    onAfterEditing,
  ])

  const getTooltip = () => {
    if (OutputProfile.isPlugin(profile)) {
      return localize(Localization.OUTPUT_PROFILE_EDIT_IS_NOT_ALLOWED_PLUGINS)
    }

    return localize(Localization.EDIT)
  }

  const EditDrawer = useMemo(() => {
    if (OutputProfile.isPlugin(profile)) {
      return null
    }

    if (OutputProfile.getOutputProfileTypeBySchema(profile) === OutputProfileType.BY_EXTRACTOR) {
      return (
        <OutputProfileByExtractorDrawer
          documentTypeFields={documentType.fields}
          isEditMode={true}
          isLoading={isUpdating}
          onSubmit={updateProfile}
          profile={profile}
          setVisible={setIsDrawerVisible}
          visible={isDrawerVisible}
        />
      )
    }

    return (
      <OutputProfileByLayoutDrawer
        isEditMode={true}
        isLoading={isUpdating}
        onSubmit={updateProfile}
        profile={profile}
        setVisible={setIsDrawerVisible}
        visible={isDrawerVisible}
      />
    )
  }, [
    documentType.fields,
    isDrawerVisible,
    isUpdating,
    profile,
    updateProfile,
  ])

  return (
    <>
      <ActionIcon
        data-testid={TEST_ID.EDIT_BUTTON}
        disabled={isUpdating || OutputProfile.isPlugin(profile)}
        icon={<PenIcon />}
        onClick={() => setIsDrawerVisible(true)}
        tooltip={
          {
            title: getTooltip(),
          }
        }
      />
      {EditDrawer}
    </>
  )
}

EditOutputProfileButton.propTypes = {
  onAfterEditing: PropTypes.func.isRequired,
  profile: outputProfileShape.isRequired,
  documentType: documentTypeShape.isRequired,
}

export {
  EditOutputProfileButton,
}
