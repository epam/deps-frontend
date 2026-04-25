
import { ResponsivePie } from '@nivo/pie'
import {
  useEffect,
  useState,
  useCallback,
} from 'react'
import { documentsApi } from '@/api/documentsApi'
import { Spin } from '@/components/Spin'
import { DocumentFilterKeys, PaginationKeys } from '@/constants/navigation'
import { DocumentTypesByStateDrawer } from '@/containers/DocumentTypesByStateDrawer'
import {
  DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE,
  DocumentStatisticState,
  RESOURCE_DOCUMENT_STATISTIC_STATE,
} from '@/enums/DocumentStatisticState'
import { Localization, localize } from '@/localization/i18n'
import { theme } from '@/theme/theme.default'
import {
  ChartWrapper,
  ChartTitle,
  DiagramWrapper,
  ContentWrapper,
} from './DocumentsStatesChart.styles'
import { DocumentsStatesLegend } from './DocumentsStatesLegend'

const DOCUMENT_STATISTIC_STATE_TO_COLOR = {
  [DocumentStatisticState.IN_PROCESSING]: theme.color.processingStatus,
  [DocumentStatisticState.NEEDS_REVIEW]: theme.color.needsReviewStatus,
  [DocumentStatisticState.IN_REVIEW]: theme.color.inReviewStatus,
  [DocumentStatisticState.COMPLETED]: theme.color.completedStatus,
  [DocumentStatisticState.FAILED]: theme.color.failedStatus,
}

const getDocumentsByStates = (states) => (
  Promise.all(
    states.map((state) =>
      documentsApi.getDocuments({
        [DocumentFilterKeys.STATES]: state,
        [PaginationKeys.PER_PAGE]: 1,
      }),
    ),
  )
)

const DocumentsStatesChart = () => {
  const [config, setConfig] = useState([])
  const [activeState, setActiveState] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getDocumentsStatesConfig = useCallback(async () => {
    try {
      setIsLoading(true)

      const documentsByStates = await getDocumentsByStates(
        Object.values(DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE),
      )

      const statesConfig = documentsByStates.reduce((acc, document, i) => {
        if (document.meta.total) {
          const currentDocumentsState = Object.keys(DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE)[i]

          acc.push({
            id: RESOURCE_DOCUMENT_STATISTIC_STATE[currentDocumentsState],
            value: document.meta.total,
            states: DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE[currentDocumentsState],
            color: DOCUMENT_STATISTIC_STATE_TO_COLOR[currentDocumentsState],
          })
        }

        return acc
      }, [])

      setConfig(statesConfig)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setState = ({ id, data }) => {
    setActiveState({
      name: id,
      states: data.states,
    })
  }

  const closeDrawer = () => setActiveState(null)

  useEffect(() => {
    getDocumentsStatesConfig()
  }, [getDocumentsStatesConfig])

  return (
    <>
      <ChartWrapper>
        <ChartTitle>
          {localize(Localization.DOCUMENTS_BY_STATES)}
        </ChartTitle>
        <Spin spinning={isLoading}>
          <ContentWrapper>
            <DiagramWrapper>
              <ResponsivePie
                activeInnerRadiusOffset={5}
                activeOuterRadiusOffset={5}
                borderColor={{ theme: 'background' }}
                borderWidth={1}
                colors={{ datum: 'data.color' }}
                cornerRadius={0}
                data={config}
                enableArcLabels={false}
                enableArcLinkLabels={false}
                innerRadius={0.6}
                margin={
                  {
                    top: 10,
                    right: 16,
                    bottom: 10,
                    left: 16,
                  }
                }
                onClick={setState}
                padAngle={2}
              />
            </DiagramWrapper>
            <DocumentsStatesLegend config={config} />
          </ContentWrapper>
        </Spin>
      </ChartWrapper>
      <DocumentTypesByStateDrawer
        activeState={activeState}
        closeDrawer={closeDrawer}
      />
    </>
  )
}

export {
  DocumentsStatesChart,
}
