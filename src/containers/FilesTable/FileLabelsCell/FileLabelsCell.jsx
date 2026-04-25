
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
import { LongTagsList } from '@/containers/LongTagsList'
import { Tag } from '@/models/Tag'

const CELL_OFFSET = 20

export const FileLabelsCell = ({
  labels,
}) => {
  const tags = useMemo(() => labels.map((text, index) =>
    new Tag({
      id: `${text}-${index}`,
      text,
    })), [labels])

  return (
    <LongTagsList
      icon={<LayerGroupIcon />}
      offset={CELL_OFFSET}
      tags={tags}
    />
  )
}

FileLabelsCell.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
}
