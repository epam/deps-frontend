
import PropTypes from 'prop-types'
import { createProfileOutput } from '@/api/outputProfilesApi'
import { LongText } from '@/components/LongText'
import { Switch } from '@/components/Switch'
import { OutputState } from '@/enums/OutputState'
import { Localization, localize } from '@/localization/i18n'
import { outputShape } from '@/models/Output'
import { outputProfileShape } from '@/models/OutputProfile'
import { toLocalizedDateString } from '@/utils/dayjs'
import { removeFileExtension } from '@/utils/file'
import { ProfileStatus } from '../enums/ProfileStatus'
import { OutputCommandBar } from '../OutputCommandBar'
import { OutputNotification } from '../OutputNotification'
import {
  Card,
  Content,
  Header,
  InfoColl,
  InfoRow,
  HeaderTitle,
  HeaderCreatedInfo,
  DateText,
  ValidationSwitch,
  Label,
} from './OutputCard.styles'

const getProfileStatus = (profile, profileInfo) => {
  if (!profile) {
    return ProfileStatus.DELETED
  }

  if (profileInfo.version !== profile.version) {
    return ProfileStatus.OUTDATED
  }

  return ProfileStatus.UP_TO_DATE
}

const getOutputFileName = (documentTitle, profileName) => {
  const adjustedTitle = removeFileExtension(documentTitle)
  return `${adjustedTitle}(${profileName})`
}

const OutputCard = ({
  output,
  profile,
  documentId,
  documentTitle,
  documentTypeId,
  reloadData,
}) => {
  const { profileInfo, creationDate, state, filePath, id } = output

  const profileStatus = getProfileStatus(profile, profileInfo)

  const shouldRenderNotification = (
    profileStatus !== ProfileStatus.UP_TO_DATE ||
    state === OutputState.PENDING
  )

  const regenerateOutput = async () => {
    await createProfileOutput({
      documentId,
      documentTypeId,
      profileId: profile.id,
    })

    await reloadData()
  }

  return (
    <Card profileStatus={profileStatus}>
      <Header>
        <HeaderTitle>
          <LongText
            text={profile?.name}
          />
          <HeaderCreatedInfo>
            {localize(Localization.CREATED_DATE)}
            {' '}
            <DateText>
              {toLocalizedDateString(creationDate, true)}
            </DateText>
          </HeaderCreatedInfo>
        </HeaderTitle>
        <OutputCommandBar
          documentId={documentId}
          filePath={filePath}
          isPending={state === OutputState.PENDING}
          name={getOutputFileName(documentTitle, profile?.name)}
          outputId={id}
          reloadData={reloadData}
        />
      </Header>
      <Content>
        <InfoRow>
          <InfoColl>
            {profile?.format}
          </InfoColl>
          <InfoColl>
            {
              profile && profile.schema !== null && (
                <ValidationSwitch>
                  <Label>
                    {localize(Localization.VALIDATION_ERRORS)}
                  </Label>
                  <Switch
                    checked={profile.schema.needsValidationResults}
                    disabled
                  />
                </ValidationSwitch>
              )
            }
          </InfoColl>
        </InfoRow>
        {
          shouldRenderNotification && (
            <OutputNotification
              onClick={regenerateOutput}
              profileStatus={profileStatus}
              state={state}
            />
          )
        }
      </Content>
    </Card>
  )
}

OutputCard.propTypes = {
  documentId: PropTypes.string,
  documentTitle: PropTypes.string,
  documentTypeId: PropTypes.string,
  output: outputShape.isRequired,
  profile: outputProfileShape,
  reloadData: PropTypes.func.isRequired,
}

export {
  OutputCard,
}
