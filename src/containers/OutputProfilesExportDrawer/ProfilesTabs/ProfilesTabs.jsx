
import PropTypes from 'prop-types'
import {
  useMemo,
  useCallback,
} from 'react'
import { Tab } from '@/components/Tabs'
import { OutputProfileByExtractor } from '@/containers/OutputProfileByExtractor'
import { OutputProfileByLayout } from '@/containers/OutputProfileByLayout'
import { OutputProfileType } from '@/enums/OutputProfileType'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { outputProfileShape, OutputProfile } from '@/models/OutputProfile'
import { ProfileHeader } from '../ProfileHeader'
import { Tabs, TabWrapper } from './ProfilesTabs.styles'

const ProfilesTabs = ({
  activeProfile,
  fields,
  profiles,
  setActiveProfile,
}) => {
  const onTabChangeHandler = (profileId) => {
    const activeProfile = profiles.find((profile) => profile.id === profileId)

    setActiveProfile(activeProfile)
  }

  const getProfileToRender = useCallback((profile) => {
    const profileType = OutputProfile.getOutputProfileTypeBySchema(profile)

    return (
      <TabWrapper>
        <ProfileHeader
          profile={profile}
        />
        {
          profileType === OutputProfileType.BY_EXTRACTOR && (
            <OutputProfileByExtractor
              fields={fields}
              profileFields={profile.schema.fields}
            />
          )
        }
        {
          profileType === OutputProfileType.BY_LAYOUT && (
            <OutputProfileByLayout
              features={profile.schema.features}
            />
          )
        }
      </TabWrapper>
    )
  }, [fields])

  const tabs = useMemo(() => (
    profiles.map((profile) => (
      new Tab(
        profile.id,
        profile.name,
        getProfileToRender(profile),
      )
    ))
  ), [getProfileToRender, profiles])

  if (profiles.length === 1) {
    return getProfileToRender(profiles[0])
  }

  return (
    <Tabs
      activeKey={activeProfile?.id}
      animated={false}
      onChange={onTabChangeHandler}
      tabs={tabs}
    />
  )
}

ProfilesTabs.propTypes = {
  activeProfile: outputProfileShape,
  fields: PropTypes.arrayOf(documentTypeFieldShape).isRequired,
  profiles: PropTypes.arrayOf(
    outputProfileShape,
  ).isRequired,
  setActiveProfile: PropTypes.func.isRequired,
}

export {
  ProfilesTabs,
}
