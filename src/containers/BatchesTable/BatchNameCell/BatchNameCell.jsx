
import PropTypes from 'prop-types'
import { LongText } from '@/components/LongText'
import { batchFileMinimizedShape } from '@/models/Batch'
import { FilesBatchCountTag } from '../FilesBatchCountTag'
import { Wrapper } from './BatchNameCell.styles'

const BatchNameCell = ({ name, files }) => (
  <Wrapper>
    <LongText text={name} />
    <FilesBatchCountTag files={files} />
  </Wrapper>
)

BatchNameCell.propTypes = {
  name: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(
    batchFileMinimizedShape,
  ).isRequired,
}

export { BatchNameCell }
