import { useParams } from 'react-router-dom'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { FolderClosedIcon } from '@/components/Icons/FolderClosedIcon'
import { LongText } from '@/components/LongText'
import {
  FontIconWrapper,
  Wrapper,
} from './BatchGroupInfo.styles'

export const BatchGroupInfo = () => {
  const { id } = useParams()

  const { data } = useFetchBatchQuery(id)

  if (!data.group) {
    return null
  }

  return (
    <Wrapper>
      <FontIconWrapper>
        <FolderClosedIcon />
      </FontIconWrapper>
      <LongText text={data.group.name} />
    </Wrapper>
  )
}
