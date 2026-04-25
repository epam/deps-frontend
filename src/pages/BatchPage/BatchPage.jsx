
import { useParams, Redirect } from 'react-router-dom'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { Content } from '@/components/Layout'
import { Spin } from '@/components/Spin'
import { StatusCode } from '@/enums/StatusCode'
import { BatchFilesCounter } from '@/pages/BatchPage/BatchFilesCounter'
import { BatchFilesTable } from '@/pages/BatchPage/BatchFilesTable'
import { BatchPageHeader } from '@/pages/BatchPage/BatchPageHeader'
import { navigationMap } from '@/utils/navigationMap'
import { PageContent } from './BatchPage.styles'

const BatchPage = () => (
  <Content>
    <BatchPageHeader />
    <PageContent>
      <BatchFilesCounter />
      <BatchFilesTable />
    </PageContent>
  </Content>
)

const BatchPageDataGuard = () => {
  const { id } = useParams()

  const {
    isFetching,
    isError,
    error,
  } = useFetchBatchQuery(
    id,
    {
      refetchOnMountOrArgChange: true,
    },
  )

  if (isFetching) {
    return (
      <Spin.Centered spinning />
    )
  }

  if (isError && error?.status === StatusCode.NOT_FOUND) {
    return (
      <Redirect to={navigationMap.error.notFound()} />
    )
  }

  return <BatchPage />
}

export {
  BatchPageDataGuard as BatchPage,
}
