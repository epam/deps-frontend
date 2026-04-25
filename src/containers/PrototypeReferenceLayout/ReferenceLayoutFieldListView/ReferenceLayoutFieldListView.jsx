
import PropTypes from 'prop-types'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { KeyValueList } from './KeyValueList'
import { Wrapper } from './ReferenceLayoutFieldListView.styles'
import { TableList } from './TableList'

const ReferenceLayoutFieldListView = ({
  prototypeMappingKeys,
  fieldsViewType,
  isEditMode,
}) => (
  <Wrapper>
    {
      fieldsViewType === PrototypeViewType.TABLES
        ? <TableList isEditMode={isEditMode} />
        : <KeyValueList prototypeMappingKeys={prototypeMappingKeys} />
    }
  </Wrapper>
)

ReferenceLayoutFieldListView.propTypes = {
  fieldsViewType: PropTypes.oneOf(
    Object.values(PrototypeViewType),
  ).isRequired,
  prototypeMappingKeys: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ),
  isEditMode: PropTypes.bool.isRequired,
}

export {
  ReferenceLayoutFieldListView,
}
