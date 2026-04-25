
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Input,
  ValidationError,
} from './ProfileTitle.styles'

const INPUT_MAX_LENGTH = 50

const validateProfileName = (name) => {
  if (!name) {
    return {
      isValid: false,
      message: localize(Localization.REQUIRED_VALIDATOR_ERROR_MESSAGE),
    }
  }

  if (name.length > INPUT_MAX_LENGTH) {
    return {
      isValid: false,
      message: localize(Localization.MAXIMUM_SYMBOLS_ERROR, {
        maximumSymbols: INPUT_MAX_LENGTH,
      }),
    }
  }

  return {
    isValid: true,
  }
}

const ProfileTitle = ({
  profileName,
  updateProfile,
  setIsProfileNameValid,
}) => {
  const onInputChange = useCallback((e) => {
    const normalizedValue = e.target.value.trimStart()
    const isValidName = validateProfileName(normalizedValue).isValid

    updateProfile((profile) => ({
      ...profile,
      name: normalizedValue,
    }))

    setIsProfileNameValid(isValidName)
  }, [setIsProfileNameValid, updateProfile])

  return (
    <Wrapper>
      <Input
        $hasError={!profileName}
        onChange={onInputChange}
        placeholder={
          localize(Localization.PROFILE_NAME_PLACEHOLDER)
        }
        value={profileName}
      />
      <ValidationError>
        {validateProfileName(profileName).message}
      </ValidationError>
    </Wrapper>
  )
}

ProfileTitle.propTypes = {
  profileName: PropTypes.string,
  updateProfile: PropTypes.func.isRequired,
  setIsProfileNameValid: PropTypes.func.isRequired,
}

export {
  ProfileTitle,
}
