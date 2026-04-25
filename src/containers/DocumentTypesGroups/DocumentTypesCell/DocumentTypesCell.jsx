
import PropTypes from 'prop-types'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
import { LongTagsList } from '@/containers/LongTagsList'
import { Tag } from '@/models/Tag'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'

const CELL_OFFSET = 20

const DocumentTypesCell = memo(({
  documentTypesIds,
}) => {
  const documentTypes = useSelector(documentTypesSelector)

  const typesToDisplay = documentTypes
    ?.filter((type) => documentTypesIds.includes(type.code))
    .map((documentType) => new Tag({
      id: documentType.code,
      text: documentType.name,
    }))

  return (
    <LongTagsList
      icon={<LayerGroupIcon />}
      offset={CELL_OFFSET}
      tags={typesToDisplay}
    />
  )
})

DocumentTypesCell.propTypes = {
  documentTypesIds: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
}

export {
  DocumentTypesCell,
}
