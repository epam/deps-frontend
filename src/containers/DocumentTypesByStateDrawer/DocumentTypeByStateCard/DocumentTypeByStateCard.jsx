
import PropTypes from 'prop-types'
import {
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { documentsApi } from '@/api/documentsApi'
import { ExternalLinkAltIcon } from '@/components/Icons/ExternalLinkAlt'
import { StatisticCard } from '@/components/StatisticCard'
import { DocumentFilterKeys, PaginationKeys } from '@/constants/navigation'
import { DocumentState } from '@/enums/DocumentState'
import { Placement } from '@/enums/Placement'
import { useAbortRequest } from '@/hooks/useAbortRequest'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { IconButton } from './DocumentTypeByStateCard.styles'
import { RequestStack } from './RequestStack'

const REDIRECTION_BUTTON_TOOLTIP = {
  placement: Placement.TOP,
  title: localize(Localization.GO_TO_DOCUMENTS),
}

const requestStack = new RequestStack()

const DocumentTypeByStateCard = ({
  documentType,
  limitValue,
  states,
}) => {
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { signal, isCanceled } = useAbortRequest()

  const dispatch = useDispatch()

  const getDocsQuantityByStatesAndDocType = useCallback(async () => {
    try {
      const { meta } = await documentsApi.getDocuments({
        [DocumentFilterKeys.STATES]: states,
        [DocumentFilterKeys.TYPES]: [documentType.code],
        [PaginationKeys.PER_PAGE]: 1,
      }, {
        signal,
      })

      setTotalQuantity(meta.total)
    } catch (e) {
      if (isCanceled(e)) {
        return
      }

      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsLoading(false)
    }
  }, [
    documentType.code,
    states,
    isCanceled,
    signal,
  ])

  useEffect(() => {
    setIsLoading(true)
    const remove = requestStack.add(getDocsQuantityByStatesAndDocType)
    return remove
  }, [getDocsQuantityByStatesAndDocType])

  const goToDocumentsPage = () => {
    dispatch(goTo(
      navigationMap.documents(),
      {
        filters: {
          [DocumentFilterKeys.TYPES]: [documentType.code],
          [DocumentFilterKeys.STATES]: states,
        },
      }))
  }

  const renderButtonIcon = () => (
    <IconButton
      icon={<ExternalLinkAltIcon />}
      onClick={goToDocumentsPage}
      tooltip={REDIRECTION_BUTTON_TOOLTIP}
    />
  )

  return (
    <StatisticCard
      currentValue={totalQuantity}
      isLoading={isLoading}
      renderExtra={renderButtonIcon}
      title={documentType.name}
      totalValue={limitValue}
    />
  )
}

DocumentTypeByStateCard.propTypes = {
  documentType: documentTypeShape.isRequired,
  limitValue: PropTypes.number.isRequired,
  states: PropTypes.arrayOf(
    PropTypes.oneOf(
      Object.values(DocumentState),
    ),
  ),
}

export {
  DocumentTypeByStateCard,
}
