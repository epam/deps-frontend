
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { createProfileOutputV2 } from '@/api/outputProfilesApi'
import { localize, Localization } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { OutputProfile } from '@/models/OutputProfile'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import {
  ArrowIcon,
  CustomSubMenu,
  MenuItem,
  Title,
} from './ExportByProfilePluginsMenu.styles.js'

const TEST_ID = {
  ARROW_ICON: 'arrow-icon',
  TITLE: 'title',
}

export const ExportByProfilePluginsMenu = ({ documentType }) => {
  const { documentId } = useParams()

  const [isLoading, setIsLoading] = useState(false)

  const runOutputPlugin = async (profileId) => {
    setIsLoading(true)

    try {
      await createProfileOutputV2({
        documentId,
        documentTypeId: documentType.code,
        profileId,
      })
      notifySuccess(localize(Localization.EXPORT_BY_PROFILE_PLUGINS_SUCCESS))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsLoading(false)
    }
  }

  const pluginOutputProfiles = documentType?.profiles?.filter((p) => OutputProfile.isPlugin(p)) ?? []

  const isDisabled = isLoading || !pluginOutputProfiles.length

  return (
    <CustomSubMenu
      disabled={isDisabled}
      title={
        (
          <Title data-testid={TEST_ID.TITLE}>
            {localize(Localization.EXPORT_BY_PROFILE_PLUGINS)}
            <ArrowIcon
              $disabled={isDisabled}
              data-testid={TEST_ID.ARROW_ICON}
            />
          </Title>
        )
      }
    >
      {
        pluginOutputProfiles.map((profile) => (
          <MenuItem
            key={profile.id}
            disabled={isLoading}
            onClick={() => runOutputPlugin(profile.id)}
          >
            {profile.name}
          </MenuItem>
        ))
      }
    </CustomSubMenu>
  )
}

ExportByProfilePluginsMenu.propTypes = {
  documentType: documentTypeShape,
}
