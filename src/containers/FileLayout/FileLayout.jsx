
import {
  useEffect,
} from 'react'
import { useParams } from 'react-router-dom'
import { useFetchFileParsingInfoQuery } from '@/apiRTK/fileLayoutApi'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { NoData } from '@/components/NoData'
import { Spin } from '@/components/Spin'
import { EntityLayout } from '@/containers/ParsingLayout/EntityLayout'
import { TabularLayout } from '@/containers/ParsingLayout/TabularLayout'
import { localize, Localization } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'

export const FileLayout = () => {
  const { fileId } = useParams()

  const { data: file } = useFetchFileQuery(fileId)

  const {
    data,
    isFetching: isParsingInfoFetching,
    isError: isParsingInfoError,
    refetch,
  } = useFetchFileParsingInfoQuery(fileId)

  useEffect(() => {
    refetch()
  }, [
    file?.state?.status,
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
    file?.state?.status,
  ])

  if (isParsingInfoFetching) {
    return (
      <Spin.Centered spinning />
    )
  }

  if (data?.tabularLayoutInfo) {
    return (
      <TabularLayout
        layoutInfo={data.tabularLayoutInfo}
      />
    )
  }

  if (!data?.documentLayoutInfo) {
    return (
      <NoData description={localize(Localization.NOTHING_TO_DISPLAY)} />
    )
  }

  return (
    <EntityLayout rawParsingInfoData={data} />
  )
}
