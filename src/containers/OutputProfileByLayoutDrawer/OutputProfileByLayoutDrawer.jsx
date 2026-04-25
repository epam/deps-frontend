
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ButtonType, Button } from '@/components/Button'
import { Localization, localize } from '@/localization/i18n'
import {
  documentLayoutShape,
  formatShape,
  outputProfileShape,
} from '@/models/OutputProfile'
import { theme } from '@/theme/theme.default'
import { LayoutEngine } from './LayoutEngine'
import { LayoutFeatures } from './LayoutFeatures'
import { OutputFormat } from './OutputFormat'
import {
  CancelButton,
  Drawer,
  DrawerFooterWrapper,
  Title,
} from './OutputProfileByLayoutDrawer.styles'
import { ProfileTitle } from './ProfileTitle'

const OutputProfileByLayoutDrawer = ({
  isEditMode,
  isLoading,
  onSubmit,
  profile: originalProfile,
  setVisible,
  visible,
}) => {
  const [isProfileNameValid, setIsProfileNameValid] = useState(!!isEditMode)
  const [profile, setProfile] = useState(originalProfile)

  const isSubmitDisabled = isLoading || !isProfileNameValid

  useEffect(() => {
    if (!visible) {
      setProfile(originalProfile)
      setIsProfileNameValid(!!isEditMode)
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
        {isEditMode ? localize(Localization.SUBMIT) : localize(Localization.CREATE)}
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
          : localize(Localization.LAYOUT_PROFILE)
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
      width={theme.size.drawerWidth}
    >
      <>
        <ProfileTitle
          isProfileNameValid={isProfileNameValid}
          profileName={profile?.name}
          setIsProfileNameValid={setIsProfileNameValid}
          updateProfile={setProfile}
        />
        <LayoutFeatures
          features={profile?.schema?.features}
          updateProfile={setProfile}
        />
        <LayoutEngine
          engine={profile?.schema?.parsingType}
          updateProfile={setProfile}
        />
        <OutputFormat
          format={profile?.format}
          updateProfile={setProfile}
        />
      </>
    </Drawer>
  )
}

OutputProfileByLayoutDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.oneOfType([
    outputProfileShape,
    PropTypes.shape({
      format: formatShape.isRequired,
      name: PropTypes.string.isRequired,
      schema: documentLayoutShape.isRequired,
    }),
  ]).isRequired,
}

export {
  OutputProfileByLayoutDrawer,
}
