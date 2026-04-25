
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { iamApi } from '@/api/iamApi'
import { Menu } from '@/components/Menu'
import { Tooltip } from '@/components/Tooltip'
import { localize, Localization } from '@/localization/i18n'
import { organisationShape } from '@/models/Organisation'
import { organisationsSelector } from '@/selectors/organisations'
import { notifyRequest } from '@/utils/notification'
import { SubMenu, Text, TypographyText } from './UserOrganisations.styles'

const UserOrganisations = ({ organisations }) => {
  const onClick = async (orgPk) => {
    await notifyRequest(iamApi.activateUserOrganisation(orgPk))({
      fetching: localize(Localization.ACTIVE_ORGANISATION_FETCHING),
      success: localize(Localization.ACTIVE_ORGANISATION_SUCCESS),
      warning: localize(Localization.ACTIVE_ORGANISATION_ERROR),
    })

    window.location.reload()
  }

  if (organisations.length <= 1) {
    return (
      <Menu.Item disabled>
        <Tooltip
          title={localize(Localization.NO_ANOTHER_ORGANISATION)}
        >
          <Text>
            {localize(Localization.CHANGE_ORGANISATION)}
          </Text>
        </Tooltip>
      </Menu.Item>
    )
  }

  return (
    <SubMenu
      title={localize(Localization.CHANGE_ORGANISATION)}
    >
      {
        organisations.map((el) => (
          <Menu.Item
            key={el.pk}
            onClick={() => onClick(el.pk)}
          >
            <TypographyText
              content={el.name}
              ellipsis={{ tooltip: el.name }}
            />
          </Menu.Item>
        ))
      }
    </SubMenu>
  )
}

const mapStateToProps = (state) => ({
  organisations: organisationsSelector(state),
})

UserOrganisations.propTypes = {
  organisations: PropTypes.arrayOf(organisationShape).isRequired,
}

const ConnectedComponent = connect(mapStateToProps)(UserOrganisations)

export {
  ConnectedComponent as UserOrganisations,
}
