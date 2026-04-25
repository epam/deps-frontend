
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { PatternValidator, MaxLengthValidator } from '@/components/Form/ReactHookForm'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { SelectMode } from '@/components/Select'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { KeyCode } from '@/enums/KeyCode'
import { Localization, localize } from '@/localization/i18n'
import { TableCellLayout } from '@/models/DocumentLayout'
import { PrototypeTableHeader, TableHeaderType } from '@/models/PrototypeTableField'
import { activeTableSelector } from '@/selectors/prototypePage'
import { AddTableHeadersButton } from '../AddTableHeadersButton'
import { EmptyTableHeaders } from '../EmptyTableHeaders'
import {
  CustomSelect,
  DraggableItem,
  FormItem,
  HeaderNameIcon,
  HeaderTitleWrapper,
  IconButton,
  Input,
  Title,
  TitleWrapper,
  Wrapper,
  RequiredMark,
  AliasTag,
} from './TableHeadersSection.styles'

const FIELD_PROPERTY = {
  HEADERS: 'headers',
  ALIASES: 'aliases',
  NAME: 'name',
}

const emptyHeader = new PrototypeTableHeader({
  name: '',
  aliases: [''],
})

const extractHeaders = (table, headerType) => (
  TableCellLayout.unmergeCells(table.cells)
    .filter((cell) =>
      headerType === TableHeaderType.ROWS
        ? cell.columnIndex === 0
        : cell.rowIndex === 0,
    )
    .map(({ content, rowIndex, columnIndex }) => ({
      content,
      rowIndex,
      columnIndex,
    }),
    )
)

const getHeaderId = (colIndex, rowIndex) => (
  `${uuidv4()}_col_${colIndex}_row_${rowIndex}`
)

const TableHeadersSection = ({
  headerType,
  headersList,
  addHeaders,
  moveHeader,
  removeHeader,
}) => {
  const activeTable = useSelector(activeTableSelector)
  const [isDraggable, setIsDraggable] = useState(false)

  const {
    formState: { errors },
  } = useFormContext()

  const headersValues = useWatch({ name: FIELD_PROPERTY.HEADERS })

  const enableDragging = useCallback(() => {
    setIsDraggable(true)
  }, [setIsDraggable])

  const onDraggingDrop = useCallback(() => {
    setIsDraggable(false)
  }, [setIsDraggable])

  const onDraggingMove = useCallback((draggedIndex, hoverIndex) => {
    moveHeader(draggedIndex, hoverIndex)
  }, [moveHeader])

  const getHeaderTitle = useCallback(({ props, index }) => (
    <HeaderTitleWrapper>
      <HeaderNameIcon
        onMouseDown={enableDragging}
        onMouseUp={onDraggingDrop}
      />
      <Input
        $hasError={!!errors?.headers?.length}
        {...props}
      />
      <IconButton
        icon={<TrashIcon />}
        onClick={() => removeHeader(index)}
      />
    </HeaderTitleWrapper>
  ), [
    enableDragging,
    errors?.headers?.length,
    onDraggingDrop,
    removeHeader,
  ])

  const aliasTagRender = useCallback(({ label, value, onClose }, aliases = []) => (
    <AliasTag
      $isEmptyTag={!value}
      closable={aliases.length > 1}
      onClose={onClose}
    >
      {label}
    </AliasTag>
  ), [])

  const onAliasesInputKeyDown = useCallback((index) => (e) => {
    if (e.keyCode !== KeyCode.BACKSPACE) {
      return
    }

    const aliases = headersValues[index][FIELD_PROPERTY.ALIASES] || []

    if (aliases.length <= 1 && !e.target.value) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [headersValues])

  const getTableHeadersField = useCallback((header, index) => {
    const fieldKey = `${FIELD_PROPERTY.HEADERS}.${index}`

    return [
      {
        code: `${fieldKey}.${FIELD_PROPERTY.NAME}`,
        placeholder: localize(Localization.EMPTY_NAME),
        render: (props) => getHeaderTitle({
          props,
          index,
        }),
        rules: {
          ...new PatternValidator(
            FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
            localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
          ),
          ...new MaxLengthValidator(),
        },
      },
      {
        code: `${fieldKey}.${FIELD_PROPERTY.ALIASES}`,
        render: (fieldProps) => (
          <CustomSelect
            mode={SelectMode.TAGS}
            onInputKeyDown={onAliasesInputKeyDown(index)}
            open={false}
            options={[]}
            tagRender={(tagProps) => aliasTagRender(tagProps, fieldProps?.value)}
            {...fieldProps}
          />
        ),
      },
    ]
  }, [
    aliasTagRender,
    onAliasesInputKeyDown,
    getHeaderTitle,
  ])

  const Headers = useMemo(() => (
    <>
      {
        headersList.map((header, index) => {
          const headerField = getTableHeadersField(header, index)

          return (
            <DraggableItem
              key={header.id}
              index={index}
              isDraggable={isDraggable}
              onDrop={onDraggingDrop}
              onMove={onDraggingMove}
            >
              {
                headerField.map(({ label, requiredMark, ...field }) => (
                  <FormItem
                    key={field.code}
                    field={field}
                    label={label}
                    requiredMark={requiredMark}
                  />
                ))
              }
            </DraggableItem>
          )
        })
      }
    </>
  ), [
    headersList,
    getTableHeadersField,
    isDraggable,
    onDraggingDrop,
    onDraggingMove,
  ])

  const addNewHeader = () => {
    addHeaders([emptyHeader])
  }

  const headersData = useMemo(() => (
    activeTable ? extractHeaders(activeTable, headerType) : []
  ), [activeTable, headerType])

  const addAllHeaders = () => {
    const headersToAdd = headersData.map(({ content, columnIndex, rowIndex }) => ({
      id: getHeaderId(columnIndex, rowIndex),
      ...new PrototypeTableHeader({
        name: content,
        aliases: [content],
      }),
    }))

    addHeaders(headersToAdd, { shouldFocus: false })
  }

  const addHeaderButtonTitle = headerType === TableHeaderType.COLUMNS
    ? localize(Localization.ADD_NEW_COLUMN)
    : localize(Localization.ADD_NEW_ROW)

  const addAllHeadersButtonTitle = headerType === TableHeaderType.COLUMNS
    ? localize(Localization.ADD_ALL_COLUMNS)
    : localize(Localization.ADD_ALL_ROWS)

  return (
    <Wrapper>
      <TitleWrapper>
        <RequiredMark>*</RequiredMark>
        <Title>
          {localize(Localization.SELECTED_ELEMENTS)}
        </Title>
        <AddTableHeadersButton
          disabled={!activeTable}
          onClick={addAllHeaders}
          title={addAllHeadersButtonTitle}
        />
      </TitleWrapper>
      {
        headersList.length
          ? Headers
          : <EmptyTableHeaders />
      }
      <AddTableHeadersButton
        onClick={addNewHeader}
        title={addHeaderButtonTitle}
      />
    </Wrapper>
  )
}

TableHeadersSection.propTypes = {
  headerType: PropTypes.oneOf(
    Object.values(TableHeaderType),
  ).isRequired,
  headersList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      aliases: PropTypes.arrayOf(
        PropTypes.string,
      ).isRequired,
    }),
  ).isRequired,
  addHeaders: PropTypes.func.isRequired,
  moveHeader: PropTypes.func.isRequired,
  removeHeader: PropTypes.func.isRequired,
}

export {
  TableHeadersSection,
}
