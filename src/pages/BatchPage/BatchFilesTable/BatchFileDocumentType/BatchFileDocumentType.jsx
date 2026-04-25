
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { LongText } from '@/components/LongText'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'

export const BatchFileDocumentType = ({ documentTypeId }) => {
  const documentTypes = useSelector(documentTypesSelector)

  return (
    <LongText text={documentTypes.find((dt) => dt.id === documentTypeId)?.name} />
  )
}

BatchFileDocumentType.propTypes = {
  documentTypeId: PropTypes.string.isRequired,
}
