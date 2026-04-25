
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ApplicationLogo } from '@/containers/ApplicationLogo'
import { GlobalMenu } from '@/containers/GlobalMenu'
import { GlobalSearch } from '@/containers/GlobalSearch'
import { LanguageSwitch } from '@/containers/LanguageSwitch'
import { TrialDrawerButton } from '@/containers/TrialDrawer'
import { UiEnvSettingsDrawer } from '@/containers/UiEnvSettingsDrawer'
import { UploadDocumentButton } from '@/containers/UploadDocumentButton'
import { UploadEntities } from '@/containers/UploadEntities'
import { UserProfile } from '@/containers/UserProfile'
import { pathNameSelector } from '@/selectors/router'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import {
  Header,
  StyledLogoSearch,
  StyledWrapper,
} from './ApplicationHeader.styles'

const ApplicationHeader = ({
  pathName,
}) => {
  return (
    <Header>
      <StyledLogoSearch>
        <ApplicationLogo />
        {
          pathName.includes(navigationMap.documents()) && (
            <GlobalSearch />
          )
        }
      </StyledLogoSearch>
      {
        ENV.FEATURE_TRIAL_VERSION && (
          <TrialDrawerButton />
        )
      }
      <StyledWrapper>
        <LanguageSwitch />
        <UserProfile />
        {ENV.FEATURE_DOCUMENT_UPLOAD && !ENV.FEATURE_ENTITIES_UPLOAD && <UploadDocumentButton />}
        {ENV.FEATURE_ENTITIES_UPLOAD && <UploadEntities />}
        <GlobalMenu />
        {
          ENV.FEATURE_UI_SETTINGS && <UiEnvSettingsDrawer />
        }
      </StyledWrapper>
    </Header>
  )
}

ApplicationHeader.propTypes = {
  pathName: PropTypes.string,
}

const mapStateToProps = (state) => ({
  pathName: pathNameSelector(state),
})

const ConnectedComponent = connect(mapStateToProps)(ApplicationHeader)

export {
  ConnectedComponent as ApplicationHeader,
}
