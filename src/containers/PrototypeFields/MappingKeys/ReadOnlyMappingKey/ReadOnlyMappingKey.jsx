
import PropTypes from 'prop-types'
import { LongText } from '@/components/LongText'
import { Tag } from './ReadOnlyMappingKey.styles'

const ReadOnlyMappingKey = ({ mappingKey }) => (
  <Tag closable={false}>
    <LongText text={mappingKey} />
  </Tag>
)

ReadOnlyMappingKey.propTypes = {
  mappingKey: PropTypes.string.isRequired,
}

export {
  ReadOnlyMappingKey,
}
