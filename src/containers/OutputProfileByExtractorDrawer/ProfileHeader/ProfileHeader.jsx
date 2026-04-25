
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { Switch } from '@/components/Switch'
import { Localization, localize } from '@/localization/i18n'
import { formatShape } from '@/models/OutputProfile'
import { OutputFormat } from '../OutputFormat'
import { ProfileTitle } from '../ProfileTitle'
import {
  Wrapper,
  Controls,
  Label,
  ValidationSwitch,
} from './ProfileHeader.styles'

const ProfileHeader = ({
  profileName,
  profileFormat,
  needsValidationResults,
  setIsProfileNameValid,
  updateProfile,
}) => {
  const onChangeNeedsValidationResults = useCallback((checked) => {
    updateProfile((profile) => {
      const { schema } = profile
      return {
        ...profile,
        schema: {
          ...schema,
          needsValidationResults: checked,
        },
      }
    })
  }, [
    updateProfile,
  ])

  return (
    <Wrapper>
      <ProfileTitle
        profileName={profileName}
        setIsProfileNameValid={setIsProfileNameValid}
        updateProfile={updateProfile}
      />
      <Controls>
        <ValidationSwitch>
          <Label>
            {localize(Localization.VALIDATION_ERRORS)}
          </Label>
          <Switch
            checked={needsValidationResults}
            onChange={onChangeNeedsValidationResults}
          />
        </ValidationSwitch>
        <OutputFormat
          format={profileFormat}
          updateProfile={updateProfile}
        />
      </Controls>
    </Wrapper>
  )
}

ProfileHeader.propTypes = {
  profileName: PropTypes.string,
  profileFormat: formatShape.isRequired,
  needsValidationResults: PropTypes.bool.isRequired,
  setIsProfileNameValid: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
}

export {
  ProfileHeader,
}
