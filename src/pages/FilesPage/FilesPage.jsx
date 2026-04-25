
import isEmpty from 'lodash/isEmpty'
import {
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { useSelector } from 'react-redux'
import { useFetchFilesQuery } from '@/apiRTK/filesApi'
import { Content } from '@/components/Layout'
import { PaginationKeys } from '@/constants/navigation'
import { FILES_PER_PAGE } from '@/constants/storage'
import { AvailableFilesToggle } from '@/containers/AvailableFilesToggle'
import { FilesTable } from '@/containers/FilesTable'
import {
  useEventSource,
  KnownBusinessEvent,
} from '@/hooks/useEventSource'
import { Localization, localize } from '@/localization/i18n'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { filterSelector } from '@/selectors/navigation'
import { ENV } from '@/utils/env'
import { Header, Title } from './FilesPage.styles'

export const FilesPage = () => {
  const filters = useSelector(filterSelector)
  const addEvent = useEventSource('FilesPage')

  const initialPagination = Pagination.getInitialPagination(FILES_PER_PAGE)

  const filterConfig = useMemo(() => ({
    ...DefaultPaginationConfig,
    ...(isEmpty(filters) ? initialPagination : filters),
  }), [filters, initialPagination])

  const {
    data = {},
    isLoading,
    refetch: refetchFiles,
  } = useFetchFilesQuery(
    {
      ...filterConfig,
      [PaginationKeys.PAGE]: filterConfig.page,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  const onFileStatusUpdated = useCallback((eventData) => {
    const isFileVisible = data.result?.some((file) => file.id === eventData.fileId)
    if (isFileVisible) {
      refetchFiles()
    }
  }, [data.result, refetchFiles])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    addEvent(KnownBusinessEvent.FILE_STATE_UPDATED, onFileStatusUpdated)
  }, [addEvent, onFileStatusUpdated])

  return (
    <Content>
      <Header>
        <Title>
          {localize(Localization.FILES)}
        </Title>
        <AvailableFilesToggle filterConfig={filterConfig} />
      </Header>
      <FilesTable
        data={data}
        filterConfig={filterConfig}
        isLoading={isLoading}
      />
    </Content>
  )
}
