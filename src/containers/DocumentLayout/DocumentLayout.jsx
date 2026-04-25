
import {
  useEffect,
} from 'react'
import { useSelector } from 'react-redux'
import { useFetchParsingInfoQuery } from '@/apiRTK/documentLayoutApi'
import { Spin } from '@/components/Spin'
import { EntityLayout } from '@/containers/ParsingLayout/EntityLayout'
import { localize, Localization } from '@/localization/i18n'
import { documentSelector } from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { SpinWrapper } from './DocumentLayout.styles'

export const DocumentLayout = () => {
  const document = useSelector(documentSelector)

  const {
    isFetching: isParsingInfoFetching,
    isError: isParsingInfoError,
    refetch,
    data: rawParsingInfoData,
  } = useFetchParsingInfoQuery(document._id)

  useEffect(() => {
    refetch()
  }, [
    document.state,
    refetch,
  ])

  useEffect(() => {
    if (isParsingInfoFetching) {
      return
    }

    if (isParsingInfoError) {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }, [
    isParsingInfoFetching,
    isParsingInfoError,
    document.state,
  ])

  if (isParsingInfoFetching) {
    return (
      <SpinWrapper>
        <Spin spinning />
      </SpinWrapper>
    )
  }

  return (
    <EntityLayout rawParsingInfoData={rawParsingInfoData} />
  )
}
