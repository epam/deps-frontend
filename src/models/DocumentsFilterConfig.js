
import PropTypes from 'prop-types'

class DocumentsFilterConfig {
  constructor ({
    sortDirect = '',
    sortField = '',
    title = '',
    reviewer = '',
    states = [],
    types = [],
    dateRange = [],
    labels = [],
    languages = [],
    engines = [],
    search = '',
    groups = [],
  } = {}) {
    this.sortDirect = sortDirect
    this.sortField = sortField
    this.title = title
    this.reviewer = reviewer
    this.states = states
    this.engines = engines
    this.types = types
    this.dateRange = dateRange
    this.labels = labels
    this.languages = languages
    this.search = search
    this.groups = groups
  }
}

const documentsFilterConfigShape = PropTypes.shape({
  sortField: PropTypes.string.isRequired,
  sortDirect: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  reviewer: PropTypes.string.isRequired,
  states: PropTypes.arrayOf(PropTypes.string).isRequired,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
  dateRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  engines: PropTypes.arrayOf(PropTypes.string).isRequired,
  search: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
})

const BASE_DOCUMENTS_FILTER_CONFIG = new DocumentsFilterConfig()

export {
  DocumentsFilterConfig,
  documentsFilterConfigShape,
  BASE_DOCUMENTS_FILTER_CONFIG,
}
