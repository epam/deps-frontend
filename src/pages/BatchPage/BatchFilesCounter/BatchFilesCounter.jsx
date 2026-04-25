import { useParams } from 'react-router-dom'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { localize, Localization } from '@/localization/i18n'
import {
  Counter,
  TotalText,
  Wrapper,
} from './BatchFilesCounter.styles'

export const BatchFilesCounter = () => {
  const { id } = useParams()

  const { data } = useFetchBatchQuery(id)

  return (
    <Wrapper>
      <TotalText>{localize(Localization.FILES_TOTAL).toUpperCase()}</TotalText>
      <Counter>{data.files.length ?? 0}</Counter>
    </Wrapper>
  )
}
