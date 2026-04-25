
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { authenticationProvider } from '@/authentication'
import { MenuTrigger } from '@/components/Menu'
import { UserCard } from '@/components/UserCard'
import { UI_ENV_SETTINGS_QUERY_KEY } from '@/constants/navigation'
import { ChangeOrgNameFormButton } from '@/containers/ChangeOrgNameFormButton'
import { StartTourButton } from '@/containers/StartTourButton'
import { UserOrganisations } from '@/containers/UserOrganisations'
import { FeatureNames } from '@/enums/FeatureNames'
import { useQueryParams } from '@/hooks/useQueryParams'
import { localize, Localization } from '@/localization/i18n'
import { userShape } from '@/models/User'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { ENV } from '@/utils/env'
import { isFeatureEnabled } from '@/utils/features'
import { notifySuccess } from '@/utils/notification'
import {
  StyledMenu,
  DownIcon,
  ProfileMenuOption,
  StyledButton,
} from './UserProfile.styles'

const SETTINGS_VISIBLE = 1

const getApiKey = async () => {
  const key = authenticationProvider.getAccessToken()
  await navigator.clipboard.writeText(key)
  notifySuccess(localize(Localization.API_KEY_COPIED))
}

const UserProfile = ({ customization, user }) => {
  const { setQueryParams } = useQueryParams()

  const MenuOptions = [
    {
      content: localize(Localization.VIEW_PERMISSIONS),
      visible: isFeatureEnabled(FeatureNames.SHOW_NOT_IMPLEMENTED),
    },
    {
      content: localize(Localization.GET_API_KEY),
      onClick: getApiKey,
    },
    {
      content: <StartTourButton />,
      visible: !!customization.StartTourButton,
    },
    {
      content: localize(Localization.SUPPORT),
      visible: isFeatureEnabled(FeatureNames.SHOW_NOT_IMPLEMENTED),
    },
    {
      content: localize(Localization.DASH_CONFIGURATION),
      visible: isFeatureEnabled(FeatureNames.SHOW_NOT_IMPLEMENTED),
    },
    {
      content: <ChangeOrgNameFormButton />,
    },
    {
      content: localize(Localization.CHANGE_ORGANISATION),
      subContent: <UserOrganisations />,
      visible: true,
    },
    {
      content: localize(Localization.INTERFACE_SETTINGS),
      onClick: () => {
        setQueryParams({ [UI_ENV_SETTINGS_QUERY_KEY]: SETTINGS_VISIBLE })
      },
      visible: ENV.FEATURE_UI_SETTINGS,
    },
    {
      content: localize(Localization.LOG_OUT),
      onClick: authenticationProvider.signOut,
    },
  ]

  const getMenuItems = () => (
    MenuOptions
      .filter((option) => option.visible ?? true)
      .map((option, index) => ({
        content: () => (
          <ProfileMenuOption
            key={index}
            onClick={option.onClick}
          >
            {option.content}
          </ProfileMenuOption>
        ),
        subContent: option.subContent,
      }
      ))
  )

  return (
    <StyledMenu
      arrow
      defaultSelectedKeys={[user.organisation.pk]}
      getPopupContainer={() => document.body}
      items={getMenuItems()}
      trigger={MenuTrigger.HOVER}
    >
      <StyledButton>
        <UserCard user={user} />
        <DownIcon />
      </StyledButton>
    </StyledMenu>
  )
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
  customization: customizationSelector(state),
})

UserProfile.propTypes = {
  user: userShape,
  customization: PropTypes.shape({
    StartTourButton: PropTypes.shape({
      getUrl: PropTypes.func,
    }),
  }),
}

const ConnectedComponent = connect(mapStateToProps, null)(UserProfile)

export {
  ConnectedComponent as UserProfile,
}
