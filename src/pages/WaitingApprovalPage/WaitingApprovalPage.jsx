
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { iamApi } from '@/api/iamApi'
import { Button, ButtonType } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { DownOutlined } from '@/components/Icons/DownOutlined'
import { Menu, MenuTrigger } from '@/components/Menu'
import { ApplicationLogo } from '@/containers/ApplicationLogo'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { organisationShape } from '@/models/Organisation'
import { organisationsSelector } from '@/selectors/organisations'
import { navigationMap } from '@/utils/navigationMap'
import { notifyRequest } from '@/utils/notification'
import {
  WaitingApprovalPageWrapper,
  Title,
  Image,
  Header,
  StyledMenu,
} from './WaitingApprovalPage.styles'

const WaitingApprovalPage = ({ organisations }) => {
  const changeOrg = async (pk) => {
    await notifyRequest(iamApi.activateUserOrganisation(pk))({
      fetching: localize(Localization.ACTIVE_ORGANISATION_FETCHING),
      success: localize(Localization.ACTIVE_ORGANISATION_SUCCESS),
      warning: localize(Localization.ACTIVE_ORGANISATION_ERROR),
    })

    window.location.assign(navigationMap.documents())
  }

  const renderMenu = () => (
    <StyledMenu>
      {
        organisations.map((org) => (
          <Menu.Item
            key={org.pk}
            onClick={() => changeOrg(org.pk)}
          >
            {org.name}
          </Menu.Item>
        ))
      }
    </StyledMenu>
  )

  const getChangeOrgButton = () => {
    if (organisations.length === 1) {
      return (
        <Button
          onClick={() => changeOrg(organisations[0].pk)}
          type={ButtonType.PRIMARY}
        >
          {localize(Localization.CHANGE_ORGANISATION)}
        </Button>
      )
    }

    return (
      <Dropdown
        disabled={!organisations.length}
        dropdownRender={renderMenu}
        placement={Placement.TOP_CENTER}
        trigger={MenuTrigger.HOVER}
      >
        <Button
          type={ButtonType.PRIMARY}
        >
          {localize(Localization.CHANGE_ORGANISATION)}
          <DownOutlined />
        </Button>
      </Dropdown>
    )
  }

  return (
    <WaitingApprovalPageWrapper>
      <Header>
        <ApplicationLogo />
      </Header>
      <Title>{localize(Localization.WAITING_CONFIRMATION)}</Title>
      <Image />
      {getChangeOrgButton()}
    </WaitingApprovalPageWrapper>
  )
}

const mapStateToProps = (state) => ({
  organisations: organisationsSelector(state),
})

WaitingApprovalPage.propTypes = {
  organisations: PropTypes.arrayOf(organisationShape).isRequired,
}

const ConnectedComponent = connect(mapStateToProps)(WaitingApprovalPage)

export { ConnectedComponent as WaitingApprovalPage }
