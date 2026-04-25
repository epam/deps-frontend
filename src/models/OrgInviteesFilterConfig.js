
import PropTypes from 'prop-types'

class OrgInviteesFilterConfig {
  constructor ({
    sortDirect = '',
    sortField = '',
    email = '',
  } = {}) {
    this.sortDirect = sortDirect
    this.sortField = sortField
    this.email = email
  }
}

const OrgInviteesFilterConfigShape = PropTypes.shape({
  sortDirect: PropTypes.string,
  sortField: PropTypes.string,
  email: PropTypes.string,
})

const BASE_ORG_INVITEES_FILTER_CONFIG = new OrgInviteesFilterConfig()

export {
  OrgInviteesFilterConfig,
  OrgInviteesFilterConfigShape,
  BASE_ORG_INVITEES_FILTER_CONFIG,
}
