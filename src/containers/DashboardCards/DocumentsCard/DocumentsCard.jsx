
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentsByFilter } from '@/actions/documentsListPage'
import { DocumentIcon } from '@/components/Icons/DocumentIcon'
import { Spin } from '@/components/Spin'
import { PaginationKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { BASE_DOCUMENTS_FILTER_CONFIG } from '@/models/DocumentsFilterConfig'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { documentsTotalSelector } from '@/selectors/documentsListPage'
import { areDocumentsFetchingSelector } from '@/selectors/requests'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { openInNewTarget } from '@/utils/window'
import { Card } from '../Card'

const DocumentsCard = () => {
  const dispatch = useDispatch()
  const totalDocuments = useSelector(documentsTotalSelector)
  const areDocumentsFetching = useSelector(areDocumentsFetchingSelector)

  const documentsFilterConfig = useMemo(() => ({
    ...BASE_DOCUMENTS_FILTER_CONFIG,
    ...DefaultPaginationConfig,
    [PaginationKeys.PER_PAGE]: 1,
  }), [])

  useEffect(() => {
    dispatch(fetchDocumentsByFilter(documentsFilterConfig))
  }, [dispatch, documentsFilterConfig])

  const onClick = (event) => openInNewTarget(
    event,
    navigationMap.documents(),
    () => goTo(navigationMap.documents()),
  )

  return (
    <Spin spinning={areDocumentsFetching}>
      <Card
        count={totalDocuments}
        icon={<DocumentIcon />}
        onClick={onClick}
        title={localize(Localization.DOCUMENTS)}
      />
    </Spin>
  )
}

export {
  DocumentsCard,
}
