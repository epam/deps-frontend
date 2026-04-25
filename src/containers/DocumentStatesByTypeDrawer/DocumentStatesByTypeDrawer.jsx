
import PropTypes from 'prop-types'
import {
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { documentsApi } from '@/api/documentsApi'
import { ExternalLinkAltIcon } from '@/components/Icons/ExternalLinkAlt'
import { Spin } from '@/components/Spin'
import { StatisticCard } from '@/components/StatisticCard'
import { DocumentFilterKeys, PaginationKeys } from '@/constants/navigation'
import {
  DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE,
  DocumentStatisticState,
  RESOURCE_DOCUMENT_STATISTIC_STATE,
} from '@/enums/DocumentStatisticState'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { machineLearningModelShape } from '@/models/MachineLearningModel'
import { templateShape } from '@/models/Template'
import { theme } from '@/theme/theme.default'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { Drawer, RedirectButton } from './DocumentStatesByTypeDrawer.styles'

const REDIRECTION_BUTTON_TOOLTIP = {
  placement: Placement.TOP,
  title: localize(Localization.GO_TO_DOCUMENTS),
}

const mapDocsToDocsQuantityByState = (docs) => (
  docs.reduce((acc, { meta }, i) => {
    const key = Object.values(DocumentStatisticState)[i]
    acc[key] = meta.total

    return acc
  }, {})
)

const DocumentStatesByTypeDrawer = ({
  activeDocumentType,
  closeDrawer,
}) => {
  const [totalDocsQuantity, setTotalDocsQuantity] = useState(null)
  const [docsQuantityByState, setDocsQuantityByState] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const getFilterConfig = useCallback((states, onlyMeta = true) => {
    const typesParam = activeDocumentType.code || activeDocumentType.id
    return {
      [DocumentFilterKeys.TYPES]: [typesParam],
      ...(states && { [DocumentFilterKeys.STATES]: states }),
      ...(onlyMeta && ({ [PaginationKeys.PER_PAGE]: 1 })),
      [PaginationKeys.PAGE]: 1,
    }
  }, [activeDocumentType])

  useEffect(() => {
    if (!activeDocumentType) {
      return
    }

    const getStatisticByDocType = async () => {
      setIsLoading(true)

      try {
        const { meta } = await documentsApi.getDocuments(getFilterConfig())
        setTotalDocsQuantity(meta.total)

        const docsByDocTypeAndState = await Promise.all(
          Object.values(DocumentStatisticState).map((state) => {
            const stateParam = DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE[state]
            const filterConfig = getFilterConfig(stateParam)
            return documentsApi.getDocuments(filterConfig)
          }))

        const mappedData = mapDocsToDocsQuantityByState(docsByDocTypeAndState)
        setDocsQuantityByState(mappedData)
      } catch {
        notifyWarning(localize(Localization.DEFAULT_ERROR))
      } finally {
        setIsLoading(false)
      }
    }

    getStatisticByDocType()
  }, [
    activeDocumentType,
    getFilterConfig,
  ])

  const onButtonClick = (state) => {
    dispatch(goTo(
      navigationMap.documents(),
      {
        filters: getFilterConfig(
          DOCUMENT_STATISTIC_STATE_TO_DOCUMENT_STATE[state],
          false,
        ),
      },
    ))
  }

  const actionButtonRender = (state) => (
    <RedirectButton
      icon={<ExternalLinkAltIcon />}
      onClick={() => onButtonClick(state)}
      tooltip={REDIRECTION_BUTTON_TOOLTIP}
    />
  )

  return (
    <Drawer
      hasCloseIcon={false}
      onClose={closeDrawer}
      open={!!activeDocumentType}
      title={activeDocumentType?.name}
      width={theme.size.drawerWidth}
    >
      <Spin spinning={isLoading}>
        {
          Object.entries(docsQuantityByState).map(
            ([state, value]) => (
              <StatisticCard
                key={state}
                currentValue={value}
                renderExtra={() => actionButtonRender(state)}
                title={RESOURCE_DOCUMENT_STATISTIC_STATE[state]}
                totalValue={totalDocsQuantity}
              />
            ))
        }
      </Spin>
    </Drawer>
  )
}

DocumentStatesByTypeDrawer.propTypes = {
  activeDocumentType: PropTypes.oneOfType([
    machineLearningModelShape,
    templateShape,
  ]),
  closeDrawer: PropTypes.func.isRequired,
}

export {
  DocumentStatesByTypeDrawer,
}
