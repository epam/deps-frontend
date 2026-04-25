
import 'handsontable-mit/dist/handsontable.full.css'
import Handsontable from 'handsontable-mit'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { createRef, Component, memo } from 'react'
import SheetClip from 'sheetclip'
import { confidenceViewShape } from '@/models/confidenceView'
import { fieldValidationShape } from '@/models/DocumentValidation'
import { HighlightedField } from '@/models/HighlightedField'
import { renderCell } from './Cell'
import { StyledHotTable } from './HandsonTable.styles'
import { HTCellRange } from './models/HTCellRange'
import { htDataPropsShape } from '.'

const { SEPARATOR } = Handsontable.plugins.ContextMenu

const HandsonTableCSSquery = {
  HOLDER: '.wtHolder',
  HIDER: '.wtHolder > .wtHider',
}

const StretchColumn = {
  ALL: 'all',
  LAST: 'last',
  NONE: 'none',
}

const ContextMenuItem = {
  ROW_ABOVE: 'row_above',
  ROW_BELOW: 'row_below',
  COL_LEFT: 'col_left',
  COL_RIGHT: 'col_right',
  REMOVE_ROW: 'remove_row',
  REMOVE_COL: 'remove_col',
  UNDO: 'undo',
  REDO: 'redo',
  CUT: 'cut',
  COPY: 'copy',
  CLEAR_COL: 'clear_column',
  MAKE_READ_ONLY: 'make_read_only',
  ALIGNMENT: 'alignment',
}

const AlterOperation = {
  INSERT_ROW: 'insert_row',
  INSERT_COLUMN: 'insert_col',
  REMOVE_ROW: 'remove_row',
  REMOVE_COLUMN: 'remove_col',
}

const EventSource = {
  EDIT: 'edit',
  LOAD_DATA: 'loadData',
  POPULATE_FROM_ARRAY: 'populateFromArray',
}

const HORIZONTAL_SCROLL_HEIGHT = 20
const HEIGHT_DIFFERENCE_THRESHOLD = 1
const VIEWPORT_RENDERING_OFFSET = 5
const SCROLL_PIXEL_TOLERANCE = 1

class HandsonTable extends Component {
  static defaultProps = {
    colHeaders: true,
    contextMenuEnabled: true,
    manualColumnResize: true,
    manualRowResize: true,
    outsideClickDeselects: true,
    rowHeaders: true,
    stretchH: StretchColumn.ALL,
  }

  static propTypes = {
    afterScrollHorizontally: PropTypes.func,
    afterScrollVertically: PropTypes.func,
    alignHeightByContent: PropTypes.bool,
    cellRenderer: PropTypes.func,
    colHeaders: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    defaultContextMenuItems: PropTypes.arrayOf(
      PropTypes.oneOf([
        ...Object.values(ContextMenuItem),
        SEPARATOR,
      ]),
    ),
    // eslint-disable-next-line react/no-unused-prop-types
    forceRerenderProps: PropTypes.arrayOf(
      PropTypes.oneOfType([
        confidenceViewShape,
        fieldValidationShape,
      ]),
    ),
    extraCtxMenuConfig: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        callback: PropTypes.func,
      })),
    onAfterCreateCol: PropTypes.func,
    propsForUpdate: PropTypes.arrayOf(PropTypes.string),
    onAfterCreateRow: PropTypes.func,
    onAfterRemoveCol: PropTypes.func,
    onAfterRemoveRow: PropTypes.func,
    onChangeData: PropTypes.func,
    onSelectRange: PropTypes.func,
    readOnly: PropTypes.bool,
    renderExtra: PropTypes.func,
    rowHeaders: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
    manualColumnResize: PropTypes.bool,
    manualRowResize: PropTypes.bool,
    outsideClickDeselects: PropTypes.bool,
    stretchH: PropTypes.oneOf(Object.values(StretchColumn)),
    selectedRanges: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.number,
      ),
    ),
    saveData: PropTypes.func,
    ...htDataPropsShape,
  }

  htRef = createRef()

  clipBoardCache = null
  copyPastePlugin = null
  ht = null
  mergeCellsPlugin = null
  autoRowSizePlugin = null
  sheetClip = new SheetClip()

  defaultContextMenuItems = [
    ContextMenuItem.COPY,
    ContextMenuItem.CUT,
    {
      name: 'Paste',
      callback: () => {
        this.ht.listen()
        this.copyPastePlugin.paste(this.clipBoardCache)
      },
    },
    SEPARATOR,
    ContextMenuItem.CLEAR_COL,
    ContextMenuItem.MAKE_READ_ONLY,
    SEPARATOR,
    ContextMenuItem.REDO,
    ContextMenuItem.UNDO,
  ]

  contextMenu = {
    items: [
      ...this.defaultContextMenuItems,
      SEPARATOR,
      ...(this.props.defaultContextMenuItems ?? []),
      ...((this.props.extraCtxMenuConfig && this.props.extraCtxMenuConfig.map((c) => ({
        ...c,
        callback: async (key, selection) => {
          const sourceData = this.ht?.getSourceData()
          const newData = await c.callback(selection, sourceData)
          this.updateSelectedCells(newData)
        },
      }))) || []),
    ],
  }

  updateSelectedCells = ({ data, insert, selection }) => {
    if (insert) {
      insert.quantity !== 0 && this.ht.alter(AlterOperation.INSERT_ROW, insert.startRow, insert.quantity)

      const {
        start: { col: startCol, row: startRow },
        end: { row: endRow },
      } = selection

      const defaultData = this.ht.getData(startRow, startCol, endRow, startCol)
        .reduce((acc, [value], i) => [...acc, [startRow + i, startCol, value]], [])

      data.length
        ? this.ht.setDataAtCell(data)
        : this.ht.setDataAtCell(defaultData)
    } else {
      this.setDataAtCell(data)
    }

    this.saveData()
  }

  setDataAtCell = (dataChanges) => {
    const sourceData = this.ht?.getSourceData()
    dataChanges.forEach(([row, col, HTcell]) => {
      sourceData[row][col] = HTcell
    })
    const dataToDisplay = dataChanges.map(([r, c, cell]) => [r, c, cell.value])
    this.ht.setDataAtCell(dataToDisplay)
  }

  onAfterSelectionEnd = () => {
    if (!this.props.onSelectRange) {
      return
    }
    const ranges = this.ht.getSelectedRange()
    this.props.onSelectRange(ranges)
  }

  onBeforeChange = (changes, source) => {
    if (source === EventSource.EDIT) {
      this.props.onChangeData && this.props.onChangeData(changes)
    }
  }

  setHeight = () => {
    const hotElementRef = this.htRef.current?.hotElementRef

    this.autoRowSizePlugin?.recalculateAllRowsHeight()

    const headerHeight = this.autoRowSizePlugin?.getColumnHeaderHeight() || 0
    const tableHeight = this.autoRowSizePlugin?.heights
      .reduce((acc, current) => acc + current, headerHeight)
    const parentClientRect = hotElementRef?.offsetParent.getBoundingClientRect()
    const wrapperHeight = this.props.height ? this.props.height : hotElementRef?.offsetHeight
    const parentHeight = parentClientRect.height - parentClientRect.top - HORIZONTAL_SCROLL_HEIGHT
    const maxPossibleViewedTableHeight = Math.max(wrapperHeight, Math.abs(parentHeight))

    if (!tableHeight || !wrapperHeight) {
      return
    }

    const targetHeight = tableHeight + HORIZONTAL_SCROLL_HEIGHT

    if (Math.abs(wrapperHeight - targetHeight) <= HEIGHT_DIFFERENCE_THRESHOLD) {
      return
    }

    this.ht.updateSettings({
      height: Math.min(maxPossibleViewedTableHeight, targetHeight),
    })
  }

  onAfterChange = (changes, source) => {
    if (source === EventSource.EDIT) {
      this.saveData(changes)
    }
  }

  onAfterCreateCol = (index, amount) => {
    this.props.onAfterCreateCol && this.props.onAfterCreateCol(index, amount)
    this.saveData()
  }

  onAfterCreateRow = (index, amount) => {
    this.props.onAfterCreateRow && this.props.onAfterCreateRow(index, amount)
    this.saveData()
    this.setHeight()
  }

  onAfterRemoveCol = (index, amount) => {
    this.props.onAfterRemoveCol && this.props.onAfterRemoveCol(index, amount)
    this.saveData()
  }

  onAfterRemoveRow = (index, amount) => {
    this.props.onAfterRemoveRow && this.props.onAfterRemoveRow(index, amount)
    this.saveData()
    this.setHeight()
  }

  onCopy = (data) => {
    this.clipBoardCache = this.sheetClip.stringify(data)
  }

  onCut = (data) => {
    this.clipBoardCache = this.sheetClip.stringify(data)
  }

  onAfterUpdateSettings = () => {
    this.props.selectedRanges && requestAnimationFrame(this.scrollCellsIntoView)
  }

  cellRenderer = (instance, td, row, col, prop, value, cellProps) => {
    if (this.props.cellRenderer) {
      return this.props.cellRenderer(instance, td, row, col, prop, value, cellProps, this.ht?.getSourceData())
    }

    const extra = this.props.renderExtra?.(row, col, this.ht?.getSourceData(), instance.rootElement)

    return renderCell(td, value, cellProps, extra)
  }

  saveData = (changes) => {
    const data = this.ht?.getSourceData()
    const mergeCells = this.mergeCellsPlugin?.mergedCellsCollection?.mergedCells
    this.props.saveData(data, mergeCells, changes)
  }

  scrollCellsIntoView = () => {
    this.ht.selectCells(HighlightedField.getReducedRanges(this.props.selectedRanges), false, false)

    const [topRow, leftColumn] = HTCellRange.getTopLeftCoordinates(this.props.selectedRanges)
    this.ht.scrollViewportTo(topRow, leftColumn)
  }

  getContextMenu = () => !this.props.readOnly && this.props.contextMenuEnabled ? this.contextMenu : null

  afterScrollHorizontally= () => {
    this.props.afterScrollHorizontally?.(this.htRef)
  }

  afterScrollVertically= () => {
    this.props.afterScrollVertically?.(this.htRef)
  }

  onWheel = (e) => {
    const scrollableElement = this.ht.container.querySelector(HandsonTableCSSquery.HOLDER)

    if (!scrollableElement) {
      return
    }

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = scrollableElement

    const isScrollingDown = e.deltaY > 0
    const isScrollingUp = e.deltaY < 0

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_PIXEL_TOLERANCE
    const isAtTop = scrollTop <= SCROLL_PIXEL_TOLERANCE

    if (
      (isAtBottom && isScrollingDown) ||
      (isAtTop && isScrollingUp)
    ) {
      e.stopPropagation()

      window.scrollBy({
        top: e.deltaY,
      })
    }
  }

  getContentHeight = () => {
    const contentElement = this.ht.container.querySelector(HandsonTableCSSquery.HIDER)

    return contentElement.scrollHeight
  }

  setHeightByContent = () => {
    if (!this.ht) {
      return
    }

    const height = this.getContentHeight()
    this.ht.updateSettings({ height: height + HORIZONTAL_SCROLL_HEIGHT })
  }

  componentDidMount = () => {
    this.ht = this.htRef.current.hotInstance
    this.copyPastePlugin = this.ht.getPlugin('copyPaste')
    this.mergeCellsPlugin = this.ht.getPlugin('mergeCells')
    this.autoRowSizePlugin = this.ht.getPlugin('AutoRowSize')

    this.ht.container.addEventListener('wheel', this.onWheel)

    this.setHeight()
  }

  componentDidUpdate = (prevProps) => {
    if (!isEqual(prevProps.selectedRanges, this.props.selectedRanges) && this.props.selectedRanges) {
      this.scrollCellsIntoView()
    } else if (prevProps.selectedRanges && !this.props.selectedRanges) {
      this.ht.deselectCell()
    } else if (
      !isEqual(prevProps.forceRerenderProps, this.props.forceRerenderProps) ||
      !isEqual(prevProps.height, this.props.height)
    ) {
      this.setHeight()
    }

    if (this.props.alignHeightByContent) {
      this.setHeightByContent()
    }
  }

  componentWillUnmount = () => {
    this.ht.container.removeEventListener('wheel', this.onWheel)
  }

  shouldComponentUpdate = (nextProps) => {
    if (!this.props.propsForUpdate?.length) {
      return true
    }

    return this.props.propsForUpdate.some((prop) => !isEqual(this.props[prop], nextProps[prop]))
  }

  render = () => (
    <StyledHotTable
      ref={this.htRef}
      afterChange={this.onAfterChange}
      afterCopy={this.onCopy}
      afterCreateCol={this.onAfterCreateCol}
      afterCreateRow={this.onAfterCreateRow}
      afterCut={this.onCut}
      afterRemoveCol={this.onAfterRemoveCol}
      afterRemoveRow={this.onAfterRemoveRow}
      afterScrollHorizontally={this.afterScrollHorizontally}
      afterScrollVertically={this.afterScrollVertically}
      afterSelectionEnd={this.onAfterSelectionEnd}
      afterUpdateSettings={this.onAfterUpdateSettings}
      beforeChange={this.onBeforeChange}
      className={this.props.className}
      colHeaders={this.props.colHeaders}
      columns={this.props.columns}
      contextMenu={this.getContextMenu()}
      data={this.props.data}
      manualColumnResize={this.props.manualColumnResize}
      manualRowResize={this.props.manualRowResize}
      mergeCells={this.props.mergeCells}
      outsideClickDeselects={this.props.outsideClickDeselects}
      readOnly={this.props.readOnly}
      renderer={this.cellRenderer}
      rowHeaders={this.props.rowHeaders}
      stretchH={this.props.stretchH}
      trimWhitespace={false}
      viewportColumnRenderingOffset={VIEWPORT_RENDERING_OFFSET}
      viewportRowRenderingOffset={VIEWPORT_RENDERING_OFFSET}
    />
  )
}

const MemoHandsonTable = memo(HandsonTable)

export {
  MemoHandsonTable as HandsonTable,
  SEPARATOR,
  ContextMenuItem,
}
