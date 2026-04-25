
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  storeCurrentDocIndex,
  storePagination,
  fetchDocumentsForNavigationInfo,
} from '@/actions/documentNavigationInfo'
import { goTo } from '@/actions/navigation'
import { CaretDownIcon } from '@/components/Icons/CaretDownIcon'
import { CaretUpIcon } from '@/components/Icons/CaretUpIcon'
import { Spin } from '@/components/Spin'
import { PaginationKeys } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { documentNavigationInfoSelector } from '@/selectors/documentNavigationInfo'
import { isDocumentDataFetchingSelector } from '@/selectors/requests'
import { navigationMap } from '@/utils/navigationMap'
import { notifyInfo, notifyWarning } from '@/utils/notification'
import { NavigationButton, Wrapper } from './DocumentNavigationButton.styles'

const DocumentNavigationButton = () => {
  const [isFetching, setIsFetching] = useState(false)
  const dispatch = useDispatch()
  const { documentIds, currentDocIndex, pagination, total } = useSelector(documentNavigationInfoSelector)
  const isDocumentDataFetching = useSelector(isDocumentDataFetchingSelector)

  const page = pagination[PaginationKeys.PAGE]
  const perPage = pagination[PaginationKeys.PER_PAGE]
  const documentPositionInList = (page - 1) * perPage + currentDocIndex + 1

  const isNextButtonDisabled = documentIds.length === 0 ||
    documentPositionInList === total ||
    isFetching ||
    isDocumentDataFetching

  const isPrevButtonDisabled = documentIds.length === 0 ||
    documentPositionInList === 1 ||
    isFetching ||
    isDocumentDataFetching

  const fetchData = useCallback(async (pagination) => {
    setIsFetching(true)
    try {
      return await dispatch(fetchDocumentsForNavigationInfo(pagination))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsFetching(false)
    }
  }, [dispatch])

  const onNextClick = useCallback(async () => {
    if (currentDocIndex < documentIds.length - 1) {
      const newIndex = currentDocIndex + 1
      dispatch(storeCurrentDocIndex(newIndex))
      dispatch(goTo(navigationMap.documents.document(documentIds[newIndex])))
      return
    }

    if (documentPositionInList < total) {
      const newPagination = {
        ...pagination,
        [PaginationKeys.PAGE]: page + 1,
      }

      const newDocumentIds = await fetchData(newPagination)

      if (!newDocumentIds) {
        return
      }

      if (newDocumentIds.length > 0) {
        dispatch(storeCurrentDocIndex(0))
        dispatch(goTo(navigationMap.documents.document(newDocumentIds[0])))
        dispatch(storePagination(newPagination))
      } else {
        notifyInfo(localize(Localization.LAST_DOCUMENT_ARRIVED))
      }
    }
  }, [
    currentDocIndex,
    dispatch,
    documentIds,
    documentPositionInList,
    fetchData,
    page,
    pagination,
    total,
  ])

  const onPrevClick = useCallback(async () => {
    if (currentDocIndex > 0) {
      const newIndex = currentDocIndex - 1
      dispatch(storeCurrentDocIndex(newIndex))
      dispatch(goTo(navigationMap.documents.document(documentIds[newIndex])))
      return
    }

    if (page > 1) {
      const newPagination = {
        ...pagination,
        [PaginationKeys.PAGE]: page - 1,
      }

      const newDocumentIds = await fetchData(newPagination)

      if (!newDocumentIds) {
        return
      }

      if (newDocumentIds.length > 0) {
        const lastIndex = newDocumentIds.length - 1
        dispatch(storeCurrentDocIndex(lastIndex))
        dispatch(goTo(navigationMap.documents.document(newDocumentIds[lastIndex])))
        dispatch(storePagination(newPagination))
      } else {
        notifyInfo(localize(Localization.FIRST_DOCUMENT_ARRIVED))
      }
    }
  }, [
    currentDocIndex,
    dispatch,
    documentIds,
    fetchData,
    page,
    pagination,
  ])

  return (
    <Spin spinning={isFetching || isDocumentDataFetching}>
      <Wrapper>
        <NavigationButton
          disabled={isPrevButtonDisabled}
          icon={<CaretUpIcon />}
          onClick={onPrevClick}
          tooltip={
            {
              title: localize(Localization.PREVIOUS_DOCUMENT),
            }
          }
        />
        <NavigationButton
          disabled={isNextButtonDisabled}
          icon={<CaretDownIcon />}
          onClick={onNextClick}
          tooltip={
            {
              title: localize(Localization.NEXT_DOCUMENT),
            }
          }
        />
      </Wrapper>
    </Spin>
  )
}

export {
  DocumentNavigationButton,
}
