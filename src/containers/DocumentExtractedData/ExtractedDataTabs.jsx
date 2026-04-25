
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import {
  changeActiveTab,
  highlightPolygonCoordsField,
  highlightTableCoordsField,
  getDocumentError,
} from '@/actions/documentReviewPage'
import { NoData } from '@/components/NoData'
import { Spin } from '@/components/Spin'
import { ConfidenceLevelDropdown } from '@/containers/ConfidenceLevelDropdown'
import { DataTabsSwitcher } from '@/containers/DocumentExtractedData/DataTabsSwitcher'
import { ViewSwitcher } from '@/containers/DocumentExtractedData/ViewSwitcher'
import { FieldTypeFilterDropdown } from '@/containers/FieldTypeFilterDropdown'
import { DocumentState } from '@/enums/DocumentState'
import { GROUPING_TYPE } from '@/enums/GroupingTypeTabs'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { extendedDocumentTypeShape } from '@/models/ExtendedDocumentType'
import {
  documentTypeSelector,
  documentSelector,
  activeTabSelector,
  fieldsGroupingSelector,
} from '@/selectors/documentReviewPage'
import { isDocumentDataFetchingSelector, isDocumentErrorGettingSelector } from '@/selectors/requests'
import { ENV } from '@/utils/env'
import {
  Extra,
  Separator,
  SpinWrapper,
  Tabs,
} from './ExtractedDataTabs.styles'
import {
  mapExtractedDataToTabsByFieldsSetIndex,
  mapExtractedDataToTabsByGroup,
  mapExtractedDataToTabsByPages,
} from './mappers'
import { withShouldHideEmptyEdFields } from './withShouldHideEmptyEdFields'

const LEFT_TABS_QUANTITY = 4
const RIGHT_TABS_QUANTITY = 7
const VIEWPORT_TABS_QUANTITY = LEFT_TABS_QUANTITY + RIGHT_TABS_QUANTITY

const VIEW_GROUP_TO_TABS = {
  [GROUPING_TYPE.BY_PAGE]: mapExtractedDataToTabsByPages,
  [GROUPING_TYPE.USER_DEFINED]: mapExtractedDataToTabsByGroup,
  [GROUPING_TYPE.SET_INDEX]: mapExtractedDataToTabsByFieldsSetIndex,
}

class ExtractedDataTabs extends Component {
  static propTypes = {
    document: documentShape.isRequired,
    documentType: extendedDocumentTypeShape,
    activeTab: PropTypes.string,
    fieldsGrouping: PropTypes.string,
    changeActiveTab: PropTypes.func.isRequired,
    documentDataFetching: PropTypes.bool.isRequired,
    highlightPolygonCoordsField: PropTypes.func.isRequired,
    highlightTableCoordsField: PropTypes.func.isRequired,
    getDocumentError: PropTypes.func.isRequired,
    fetching: PropTypes.bool.isRequired,
    ShouldHideEmptyEdFields: PropTypes.func,
  }

  getTabs = () => {
    const mapExtractedDataToTabs = VIEW_GROUP_TO_TABS[this.props.fieldsGrouping]

    return mapExtractedDataToTabs({
      document: this.props.document,
      documentType: this.props.documentType,
      highlightPolygonCoordsField: this.props.highlightPolygonCoordsField,
      highlightTableCoordsField: this.props.highlightTableCoordsField,
      ShouldHideEmptyEdFields: this.props.ShouldHideEmptyEdFields,
    })
  }

  componentDidUpdate (prevProps) {
    if (this.props.document.state !== prevProps.document.state &&
      this.props.document.state === DocumentState.FAILED) {
      this.props.getDocumentError()
    }
  }

  getTabsSlice = (tabs) => {
    if (tabs.length <= VIEWPORT_TABS_QUANTITY) {
      return tabs
    }

    const startIdx = tabs.findIndex((t) => t.key === this.props.activeTab) - LEFT_TABS_QUANTITY
    const endIdx = tabs.findIndex((t) => t.key === this.props.activeTab) + RIGHT_TABS_QUANTITY

    const start = startIdx > 0 ? startIdx : 0
    const end = (endIdx > 0 && endIdx < tabs.length) ? endIdx : tabs.length

    if ((end - start) < VIEWPORT_TABS_QUANTITY) {
      return tabs.slice(start, start + VIEWPORT_TABS_QUANTITY)
    }

    return tabs.slice(start, end)
  }

  renderExtra = (tabs) => (
    <Extra>
      {
        tabs.length > VIEWPORT_TABS_QUANTITY && (
          <>
            <DataTabsSwitcher
              changeActiveTab={this.props.changeActiveTab}
              tabs={tabs.filter((t) => !t.hiddenPane)}
            />
            <Separator />
          </>
        )
      }
      {
        ENV.FEATURE_CONFIDENCE_LEVEL_VIEW &&
        ENV.FEATURE_CONFIGURABLE_CONFIDENCE_LEVEL && (
          <ConfidenceLevelDropdown
            getPopupContainer={() => document.body}
          />
        )
      }
      <FieldTypeFilterDropdown
        getPopupContainer={() => document.body}
      />
      <ViewSwitcher />
    </Extra>
  )

  availableToEditStates = [
    DocumentState.NEEDS_REVIEW,
    DocumentState.IN_REVIEW,
    DocumentState.EXPORTING,
    DocumentState.EXPORTED,
    DocumentState.COMPLETED,
  ]

  emptyDataMessageInfo = () => {
    if (
      !this.props.fetching && (
        this.props.document.error?.inState === DocumentState.DATA_EXTRACTION ||
        this.props.document.error?.inState === DocumentState.VALIDATION
      )
    ) {
      return (
        localize(Localization.EXTRACTED_DATA_IS_EMPTY)
      )
    }

    return (
      <>
        {localize(Localization.EXTRACTED_DATA_LOADING_IN_PROGRESS)}
        <SpinWrapper>
          <Spin.Centered spinning />
        </SpinWrapper>
      </>
    )
  }

  render = () => {
    if (
      !this.props.document.extractedData?.length &&
      !this.availableToEditStates.includes(this.props.document.state)
    ) {
      return (
        <NoData
          description={this.emptyDataMessageInfo()}
        />
      )
    }

    const tabs = this.getTabs()
    const activeKey = (tabs.find((t) => t.key === this.props.activeTab)?.key ?? tabs[0]?.key)

    if (this.props.documentDataFetching) return <Spin.Centered spinning />

    return (
      <Tabs
        activeKey={activeKey}
        animated={false}
        extra={this.renderExtra(tabs)}
        onChange={this.props.changeActiveTab}
        tabs={this.getTabsSlice(tabs)}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
  activeTab: activeTabSelector(state),
  fieldsGrouping: fieldsGroupingSelector(state),
  documentType: documentTypeSelector(state),
  documentDataFetching: isDocumentDataFetchingSelector(state),
  fetching: isDocumentErrorGettingSelector(state),
})

const mapDispatchToProps = {
  getDocumentError,
  changeActiveTab,
  highlightPolygonCoordsField,
  highlightTableCoordsField,
}

const ConnectedComponent = withShouldHideEmptyEdFields(
  connect(mapStateToProps, mapDispatchToProps)(ExtractedDataTabs),
)

export {
  ConnectedComponent as ExtractedDataTabs,
}
