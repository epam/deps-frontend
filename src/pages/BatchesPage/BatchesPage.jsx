
import isEmpty from 'lodash/isEmpty'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useFetchBatchesQuery } from '@/apiRTK/batchesApi'
import { Content } from '@/components/Layout'
import { PaginationKeys } from '@/constants/navigation'
import { BATCHES_PER_PAGE } from '@/constants/storage'
import { BatchesTable } from '@/containers/BatchesTable'
import { Localization, localize } from '@/localization/i18n'
import { Pagination } from '@/models/Pagination'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { filterSelector } from '@/selectors/navigation'
import { Header, Title } from './BatchesPage.styles'
import { BatchesPageActions } from './BatchesPageActions'

const BatchesPage = () => {
  const filters = useSelector(filterSelector)

  const initialPagination = Pagination.getInitialPagination(BATCHES_PER_PAGE)

  const filterConfig = useMemo(() => ({
    ...DefaultPaginationConfig,
    ...(isEmpty(filters) ? initialPagination : filters),
  }), [filters, initialPagination])

  const {
    data = {},
    isFetching,
    refetch,
  } = useFetchBatchesQuery(
    {
      ...filterConfig,
      [PaginationKeys.PAGE]: filterConfig.page - 1,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  return (
    <Content>
      <Header>
        <Title>
          {localize(Localization.BATCHES)}
        </Title>
        <BatchesPageActions refetch={refetch} />
      </Header>
      <BatchesTable
        data={data}
        filterConfig={filterConfig}
        isFetching={isFetching}
      />
    </Content>
  )
}

export {
  BatchesPage,
}
