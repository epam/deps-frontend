
import PropTypes from 'prop-types'

class OrgUserFilterConfig {
  constructor ({
    sortDirect = '',
    sortField = '',
    user = '',
  } = {}) {
    this.sortDirect = sortDirect
    this.sortField = sortField
    this.user = user
  }
}

const OrgUserFilterConfigShape = PropTypes.shape({
  sortDirect: PropTypes.string,
  sortField: PropTypes.string,
  user: PropTypes.string,
})

const BASE_ORG_USERS_FILTER_CONFIG = new OrgUserFilterConfig()

export {
  OrgUserFilterConfig,
  OrgUserFilterConfigShape,
  BASE_ORG_USERS_FILTER_CONFIG,
}
