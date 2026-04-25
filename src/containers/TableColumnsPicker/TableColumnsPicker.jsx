
import PropTypes from 'prop-types'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { saveTableColumns } from '@/actions/system'
import { Checkbox } from '@/components/Checkbox'
import { Dropdown } from '@/components/Dropdown'
import { MenuTrigger } from '@/components/Menu'
import { DocumentColumn, RESOURCE_DOCUMENT_COLUMN } from '@/containers/DocumentsTable/columns/DocumentColumn'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { childrenShape } from '@/utils/propTypes'
import {
  StyledMenuItem,
  Draggable,
  StyledMenu,
  StyledDivider,
} from './TableColumnsPicker.styles'

const DIVIDER_KEY = 'divider'
const SELECT_ALL_KEY = 'selectAll'
const TITLE_CODE = 'title'

const DRAGGABLE_TYPE = 'draggableColumn'

const DOCUMENT_COLUMNS = [
  DocumentColumn.TITLE,
  DocumentColumn.DATE,
  ...(ENV.FEATURE_DOCUMENT_TYPES_GROUPS ? [DocumentColumn.GROUP] : []),
  DocumentColumn.DOCUMENT_TYPE,
  DocumentColumn.STATE,
  DocumentColumn.ENGINE,
  DocumentColumn.LABELS,
  DocumentColumn.REVIEWER,
  DocumentColumn.LANGUAGE,
]

ENV.FEATURE_LLM_DATA_EXTRACTION && DOCUMENT_COLUMNS.push(DocumentColumn.LLM_TYPE)

const getSelectedItemsState = (columns) => (
  [...new Set([...DOCUMENT_COLUMNS, ...columns])].map((columnCode, index) => ({
    code: columnCode,
    id: index,
    checked: columns.includes(columnCode),
    disabled: columnCode === TITLE_CODE,
  }))
)

const TableColumnsPicker = ({ children, columns, saveTableColumns }) => {
  const initialSelectedItems = getSelectedItemsState(columns)
  const initialAllSelected = initialSelectedItems.every(({ checked }) => checked)
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems)
  const [allSelected, setAllSelected] = useState(initialAllSelected)
  const [visible, setVisible] = useState(false)

  // TODO: work on this logic. Might be changed when backend is ready
  // this is used to update checked columns in TableColumnsPicker when tables are loaded from local storage, otherwise they will be all checked
  useEffect(() => {
    const updatedSelectedItems = selectedItems.map((option) => ({
      ...option,
      checked: columns.indexOf(option.code) !== -1,
    }))
    setSelectedItems(updatedSelectedItems)
    const every = updatedSelectedItems.every(({ checked }) => checked)
    every ? setAllSelected(every) : setAllSelected(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  const onSelectAllClick = useCallback((checked) => {
    const updatedSelectedItems = selectedItems.map((option) => (!option.disabled ? {
      ...option,
      checked,
    } : { ...option }))
    setSelectedItems(updatedSelectedItems)
    setAllSelected(checked)
    saveTableColumns(updatedSelectedItems.filter((si) => si.checked).map((si) => si.code))
  }, [selectedItems, saveTableColumns])

  const onChange = useCallback((checked, id) => {
    if (selectedItems.find((si) => si.id === id).code === TITLE_CODE) {
      return
    }

    const updatedSelectedItems = selectedItems.map((option) => option.id === id ? {
      ...option,
      checked,
    } : option)
    setSelectedItems(updatedSelectedItems)
    const every = updatedSelectedItems.every(({ checked }) => checked)
    every ? setAllSelected(every) : setAllSelected(false)
    saveTableColumns(updatedSelectedItems.filter((si) => si.checked).map((si) => si.code))
  }, [saveTableColumns, selectedItems])

  const onDrop = useCallback(() => {
    saveTableColumns(selectedItems.filter((si) => si.checked).map((si) => si.code))
  }, [saveTableColumns, selectedItems])

  const moveItem = useCallback((draggedIndex, index) => {
    const hoveredItem = selectedItems[draggedIndex]
    const draggedItem = selectedItems[index]

    const resultArr = [...selectedItems]

    resultArr[draggedIndex] = draggedItem
    resultArr[index] = hoveredItem
    setSelectedItems(resultArr)
  }, [selectedItems])

  const renderDivider = useCallback(() => (
    <StyledDivider key={DIVIDER_KEY} />
  ), [])

  const renderPredefinedItems = useCallback(() => [
    <StyledMenuItem key={SELECT_ALL_KEY}>
      <Draggable>
        <Checkbox
          checked={allSelected}
          onChange={onSelectAllClick}
        >
          {localize(Localization.SELECT_ALL)}
        </Checkbox>
      </Draggable>
    </StyledMenuItem>,
  ], [allSelected, onSelectAllClick])

  const onCheckboxChange = useCallback((c, id) => {
    onChange(c, id)
  }, [onChange])

  const renderMenuItems = useCallback(() => selectedItems.map((item, renderIndex) => (
    <StyledMenuItem key={item.id}>
      <Draggable
        index={renderIndex}
        onDrop={onDrop}
        onMove={moveItem}
        type={DRAGGABLE_TYPE}
      >
        <Checkbox
          checked={item.checked}
          disabled={item.disabled}
          onChange={(c) => onCheckboxChange(c, item.id)}
        >
          {RESOURCE_DOCUMENT_COLUMN[item.code]}
        </Checkbox>
      </Draggable>
    </StyledMenuItem>
  )), [selectedItems, moveItem, onDrop, onCheckboxChange])

  const menuItems = useMemo(() => [
    ...renderPredefinedItems(),
    renderDivider(),
    ...renderMenuItems(),
  ], [renderPredefinedItems, renderMenuItems, renderDivider])

  const renderMenu = useCallback(() => (
    <StyledMenu>
      {menuItems}
    </StyledMenu>
  ), [menuItems])

  const getPopupContainer = (trigger) =>
    trigger.parentNode.parentNode.parentNode.parentNode

  return (
    <Dropdown
      dropdownRender={renderMenu}
      getPopupContainer={getPopupContainer}
      onOpenChange={setVisible}
      open={visible}
      trigger={[MenuTrigger.CLICK]}
    >
      {
        children || (
          <button>
            {localize(Localization.CONFIGURE_TABLE_COLUMNS)}
          </button>
        )
      }
    </Dropdown>
  )
}

TableColumnsPicker.propTypes = {
  saveTableColumns: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: childrenShape,
}

const ConnectedComponent = connect(null, {
  saveTableColumns,
})(TableColumnsPicker)

export {
  ConnectedComponent as TableColumnsPicker,
}
