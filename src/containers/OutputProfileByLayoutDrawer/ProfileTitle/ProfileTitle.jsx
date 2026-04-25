
import PropTypes from 'prop-types'
import {
  useCallback,
  useState,
} from 'react'
import { Localization, localize } from '@/localization/i18n'
import {
  Label,
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
  isProfileNameValid,
  setIsProfileNameValid,
  updateProfile,
}) => {
  const [isInputTouched, setIsInputTouched] = useState(false)

  const onInputChange = useCallback((e) => {
    setIsInputTouched(true)
    const normalizedValue = e.target.value.trimStart()
    const isValidName = validateProfileName(normalizedValue).isValid

    updateProfile((profile) => ({
      ...profile,
      name: normalizedValue,
    }))

    setIsProfileNameValid(isValidName)
  }, [
    setIsProfileNameValid,
    updateProfile,
  ])

  return (
    <Wrapper>
      <Label>
        {localize(Localization.NAME)}
      </Label>
      <Input
        $hasError={isInputTouched && !isProfileNameValid}
        onBlur={() => setIsInputTouched(true)}
        onChange={onInputChange}
        placeholder={
          localize(Localization.NAME_PLACEHOLDER)
        }
        value={profileName}
      />
      {
        isInputTouched && (
          <ValidationError>
            {validateProfileName(profileName).message}
          </ValidationError>
        )
      }
    </Wrapper>
  )
}

ProfileTitle.propTypes = {
  profileName: PropTypes.string,
  isProfileNameValid: PropTypes.bool.isRequired,
  setIsProfileNameValid: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
}

export {
  ProfileTitle,
}
