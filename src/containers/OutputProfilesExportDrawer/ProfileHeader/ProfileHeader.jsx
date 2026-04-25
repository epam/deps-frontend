
import { Switch } from '@/components/Switch'
import { OutputProfileFormatInfo } from '@/containers/OutputProfileFormatInfo'
import { OutputProfileType } from '@/enums/OutputProfileType'
import { Localization, localize } from '@/localization/i18n'
import { outputProfileShape, OutputProfile } from '@/models/OutputProfile'
import {
  Date,
  DateWrapper,
  Title,
  Description,
  Wrapper,
  Controls,
  Label,
} from './ProfileHeader.styles'

const ProfileHeader = ({ profile }) => {
  const profileType = OutputProfile.getOutputProfileTypeBySchema(profile)

  return (
    <Wrapper>
      <Description>
        <Title>
          {profile.name}
        </Title>
        <DateWrapper>
          {localize(Localization.CREATED_DATE)}
          <Date>
            {profile.creationDate}
          </Date>
        </DateWrapper>
      </Description>
      <Controls>
        <OutputProfileFormatInfo profile={profile} />
        {
          profileType === OutputProfileType.BY_EXTRACTOR && (
            <>
              <Label>
                {localize(Localization.VALIDATION_ERRORS)}
              </Label>
              <Switch
                checked={profile.schema.needsValidationResults}
                disabled
              />
            </>
          )
        }
      </Controls>
    </Wrapper>
  )
}

ProfileHeader.propTypes = {
  profile: outputProfileShape.isRequired,
}

export {
  ProfileHeader,
}
