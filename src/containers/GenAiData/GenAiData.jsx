
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGenAiFields } from '@/actions/genAiData'
import { Spin } from '@/components/Spin'
import { GenAiField } from '@/containers/GenAiField'
import { genAiFieldsSelector } from '@/selectors/genAiData'
import { areGenAiFieldsFetchingSelector } from '@/selectors/requests'
import { EmptyData } from './EmptyData'

const GenAiData = ({ openChat }) => {
  const dispatch = useDispatch()
  const fields = useSelector(genAiFieldsSelector)
  const areFieldsFetching = useSelector(areGenAiFieldsFetchingSelector)

  useEffect(() => {
    dispatch(fetchGenAiFields())
  }, [dispatch])

  if (areFieldsFetching && !fields.length) {
    return <Spin spinning />
  }

  if (!fields.length) {
    return <EmptyData onClick={openChat} />
  }

  return fields.map((field) => (
    <GenAiField
      key={field.id}
      field={field}
    />
  ))
}

GenAiData.propTypes = {
  openChat: PropTypes.func.isRequired,
}

export {
  GenAiData,
}
