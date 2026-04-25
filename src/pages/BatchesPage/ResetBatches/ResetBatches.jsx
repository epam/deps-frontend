
import { useDispatch } from 'react-redux'
import {
  setFilters,
  setPagination,
} from '@/actions/navigation'
import { Button } from '@/components/Button'
import { ResetFiltrationIcon } from '@/components/Icons/ResetFiltrationIcon'
import { Tooltip } from '@/components/Tooltip'
import { BATCHES_PER_PAGE } from '@/constants/storage'
import { localize, Localization } from '@/localization/i18n'
import { Pagination } from '@/models/Pagination'

export const ResetBatches = () => {
  const dispatch = useDispatch()

  const initialPagination = Pagination.getInitialPagination(BATCHES_PER_PAGE)

  const reset = () => {
    dispatch(setPagination(initialPagination))
    dispatch(setFilters(null))
  }

  return (
    <Tooltip title={localize(Localization.RESET_FILTERS)}>
      <Button.Secondary
        icon={<ResetFiltrationIcon />}
        onClick={reset}
      />
    </Tooltip>
  )
}
