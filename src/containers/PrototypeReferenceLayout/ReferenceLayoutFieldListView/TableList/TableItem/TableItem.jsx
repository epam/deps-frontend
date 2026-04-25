
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveTable } from '@/actions/prototypePage'
import { AddTableFieldButton } from '@/containers/PrototypeReferenceLayout/AddTableFieldButton'
import { withParentSize } from '@/hocs/withParentSize'
import { mapTableLayoutCellsToHandsonDataStrings } from '@/models/DocumentLayout/mappers'
import { tableLayoutShape } from '@/models/DocumentLayout/TableLayout'
import { activeTableSelector } from '@/selectors/prototypePage'
import { HandsonTable, Wrapper } from './TableItem.styles'

const SizedTable = withParentSize({
  noPlaceholder: true,
  monitorHeight: true,
})((props) => (
  <HandsonTable
    {...props}
    height={props.size.height}
    width={props.size.width}
  />
))

const TableItem = ({
  table,
  isEditMode,
}) => {
  const dispatch = useDispatch()
  const activeTable = useSelector(activeTableSelector)
  const isActive = activeTable?.id === table.id
  const shouldShowAddButton = isEditMode && isActive

  const { data, mergeCells } = useMemo(
    () => mapTableLayoutCellsToHandsonDataStrings(table),
    [table],
  )

  const handleOnClick = () => {
    if (!isEditMode) {
      return
    }

    dispatch(setActiveTable(table))
  }

  return (
    <Wrapper onClick={handleOnClick}>
      {shouldShowAddButton && <AddTableFieldButton />}
      <SizedTable
        $isActive={isActive}
        $isEditMode={isEditMode}
        alignHeightByContent
        data={data}
        mergeCells={mergeCells}
        readOnly
      />
    </Wrapper>
  )
}

TableItem.propTypes = {
  table: tableLayoutShape.isRequired,
  isEditMode: PropTypes.bool.isRequired,
}

export {
  TableItem,
}
