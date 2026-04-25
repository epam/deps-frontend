
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { useFetchDocumentTypesGroupQuery } from '@/apiRTK/documentTypesGroupsApi'
import { Input } from '@/components/Input'
import { documentTypesGroupShape } from '@/models/DocumentTypesGroup'

const TEST_ID = {
  GROUP_DISABLED_INPUT: 'group-disabled-input',
}

export const GroupDisabledInput = ({ value, onChange }) => {
  const { id } = useParams()

  const { data: batch } = useFetchBatchQuery(id)

  const { data } = useFetchDocumentTypesGroupQuery(
    { groupId: batch.group?.id },
    { skip: !batch.group },
  )

  useEffect(() => {
    if (!data?.group || value) {
      return
    }

    onChange(data.group)
  }, [data?.group, onChange, value])

  return (
    <Input
      data-testid={TEST_ID.GROUP_DISABLED_INPUT}
      disabled
      value={value?.name}
    />
  )
}

GroupDisabledInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: documentTypesGroupShape,
}
