
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ButtonType, Button } from '@/components/Button'
import { OutputProfileByExtractor } from '@/containers/OutputProfileByExtractor'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { extractedDataShape, formatShape, outputProfileShape } from '@/models/OutputProfile'
import {
  CancelButton,
  Drawer,
  DrawerFooterWrapper,
  OutputProfileWrapper,
  Title,
} from './OutputProfileByExtractorDrawer.styles'
import { ProfileHeader } from './ProfileHeader'

const drawerWidth = '90%'

const OutputProfileByExtractorDrawer = ({
  documentTypeFields,
  isEditMode,
  isLoading,
  onSubmit,
  profile: originalProfile,
  setVisible,
  visible,
}) => {
  const [isProfileNameValid, setIsProfileNameValid] = useState(true)
  const [profile, setProfile] = useState(originalProfile)

  const isSubmitDisabled = isLoading || !isProfileNameValid

  useEffect(() => {
    if (!visible) {
      setProfile(originalProfile)
      setIsProfileNameValid(true)
    }
  }, [
    isEditMode,
    originalProfile,
    visible,
  ])

  const toggleVisibility = useCallback(() => {
    setVisible((prev) => !prev)
  }, [
    setVisible,
  ])

  const saveProfile = useCallback(() => {
    const { name, schema, format } = profile
    onSubmit({
      name,
      schema,
      format,
    })
  }, [
    profile,
    onSubmit,
  ])

  const updateProfileFields = useCallback((profileFields) => {
    setProfile((profile) => {
      const { schema } = profile
      return {
        ...profile,
        schema: {
          ...schema,
          fields: profileFields,
        },
      }
    })
  }, [setProfile])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isLoading}
        onClick={toggleVisibility}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={isSubmitDisabled}
        loading={isLoading}
        onClick={saveProfile}
        type={ButtonType.PRIMARY}
      >
        {
          isEditMode ? localize(Localization.SUBMIT) : localize(Localization.CREATE)
        }
      </Button>
    </DrawerFooterWrapper>
  ), [
    isEditMode,
    isLoading,
    isSubmitDisabled,
    toggleVisibility,
    saveProfile,
  ])

  const DrawerTitle = useMemo(() => (
    <Title>
      {
        isEditMode
          ? localize(Localization.UPDATE_PROFILE)
          : localize(Localization.EXTRACTION_FIELDS_PROFILE)
      }
    </Title>
  ), [isEditMode])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onClose={toggleVisibility}
      open={visible}
      title={DrawerTitle}
      width={drawerWidth}
    >
      <OutputProfileWrapper>
        <ProfileHeader
          needsValidationResults={profile?.schema?.needsValidationResults}
          profileFormat={profile?.format}
          profileName={profile?.name}
          setIsProfileNameValid={setIsProfileNameValid}
          updateProfile={setProfile}
        />
        <OutputProfileByExtractor
          fields={documentTypeFields}
          isEditMode
          profileFields={profile?.schema?.fields}
          setProfileFields={updateProfileFields}
        />
      </OutputProfileWrapper>
    </Drawer>
  )
}

OutputProfileByExtractorDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  documentTypeFields: PropTypes.arrayOf(documentTypeFieldShape),
  profile: PropTypes.oneOfType([
    outputProfileShape,
    PropTypes.shape({
      format: formatShape.isRequired,
      name: PropTypes.string.isRequired,
      schema: extractedDataShape.isRequired,
    }),
  ]).isRequired,
}

export {
  OutputProfileByExtractorDrawer,
}
