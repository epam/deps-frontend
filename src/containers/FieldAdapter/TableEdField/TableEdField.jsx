
import PropTypes from 'prop-types'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { connect } from 'react-redux'
import { fetchPaginatedEdTable } from '@/actions/documents'
import { TABLE_FIELD_PAGINATION } from '@/constants/storage'
import { CoordsHighlightTrigger } from '@/containers/CoordsHighlightTrigger'
import {
  FieldLabel,
  FieldWrapper,
  InfoWrapper,
} from '@/containers/DocumentField'
import { FieldValidationResult } from '@/containers/FieldAdapter/FieldValidationResult'
import { InView } from '@/containers/InView'
import { usePrevious } from '@/hooks/usePrevious'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { FieldValidation, fieldValidationShape, FieldValidationType } from '@/models/DocumentValidation'
import { extractedDataFieldShape } from '@/models/ExtractedData'
import { TablePagination, defaultChunkSize } from '@/models/ExtractedData/TablePagination'
import { ENV } from '@/utils/env'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { Flags } from '../Flags'
import { useFieldProps } from '../useFieldProps'
import { ExtractedDataTable } from './ExtractedDataTable'
import { InfoWrapperCell } from './TableEdField.styles'
import { TableEdFieldActionsMenu } from './TableEdFieldActionsMenu'

const MIN_ROWS_CHUNK = 1

const getInitialChunkSize = (dtField) => {
  const fieldPagination = localStorageWrapper.getItem(TABLE_FIELD_PAGINATION)

  if (dtField.fieldIndex !== undefined) {
    return fieldPagination?.[dtField.pk]?.[dtField.fieldIndex] || defaultChunkSize
  }

  return fieldPagination?.[dtField.pk] || defaultChunkSize
}

const TableEdField = ({
  disabled,
  dtField,
  edField,
  id,
  validation,
  renderActions,
  documentId,
  fetchPaginatedEdTable,
  renderLabel,
}) => {
  const {
    setHighlightedField,
    highlightArea,
  } = useFieldProps(dtField, edField)
  const [rowsChunk, setRowsChunk] = useState(1)
  const [isChunkFetching, setIsChunkFetching] = useState(false)
  const prevRowsChunk = usePrevious(rowsChunk)
  const [rowsPerChunk, setRowsPerChunk] = useState(() => getInitialChunkSize(dtField))
  const prevRowsPerChunk = usePrevious(rowsPerChunk)

  const isPaginationChanged = useMemo(() => (
    (
      prevRowsChunk &&
      prevRowsChunk !== rowsChunk
    ) || (
      prevRowsPerChunk &&
      prevRowsPerChunk !== rowsPerChunk
    )
  ), [
    prevRowsChunk,
    rowsChunk,
    prevRowsPerChunk,
    rowsPerChunk,
  ])

  const isChunkShouldBeFetched = (
    (
      !!edField.data.meta?.rowsTotal && !edField.data.cells?.length
    ) ||
    isPaginationChanged
  )

  const isTablePaginated = !!edField.data.paginatedRows

  const isPaginationDisplayed = (
    (ENV.FEATURE_PAGINATED_TABLES && isTablePaginated) &&
    (edField.data.meta?.rowsTotal > defaultChunkSize)
  )

  const fetchChunk = useCallback(async () => {
    const paginationConfig = new TablePagination({
      listIndex: edField.data.meta?.listIndex,
      rowsChunk,
      rowsPerChunk,
    })

    setIsChunkFetching(true)
    await fetchPaginatedEdTable(documentId, dtField.pk, paginationConfig)
    setIsChunkFetching(false)
  }, [
    documentId,
    edField.data.meta?.listIndex,
    dtField.pk,
    fetchPaginatedEdTable,
    rowsChunk,
    rowsPerChunk,
  ])

  useEffect(() => {
    if (!isChunkShouldBeFetched || !isTablePaginated) {
      return
    }

    fetchChunk()
  }, [
    fetchChunk,
    isChunkShouldBeFetched,
    isTablePaginated,
  ])

  const getFieldPagination = useCallback((rowsPerChunk, fieldPagination) => {
    if (dtField.fieldIndex === undefined) {
      return rowsPerChunk
    }

    return {
      ...fieldPagination?.[dtField.pk],
      [dtField.fieldIndex]: rowsPerChunk,
    }
  }, [dtField])

  const savePagination = useCallback((rowsPerChunk) => {
    const fieldPagination = localStorageWrapper.getItem(TABLE_FIELD_PAGINATION)
    const preferredPagination = {
      ...fieldPagination,
      [dtField.pk]: getFieldPagination(rowsPerChunk, fieldPagination),
    }
    localStorageWrapper.setItem(TABLE_FIELD_PAGINATION, preferredPagination)
  }, [dtField, getFieldPagination])

  const paginationChangeHandler = useCallback((updatedRowsChunk, updatedRowsPerChunk) => {
    savePagination(updatedRowsPerChunk)
    setRowsPerChunk(() => updatedRowsPerChunk)
    setRowsChunk(() => updatedRowsChunk)
  }, [savePagination])

  const tableValidationConfig = useMemo(() => {
    if (!validation) {
      return null
    }

    const getItems = (items) => items?.filter((e) =>
      e.row === null &&
      e.column === null,
    )

    const validationTypes = Object.values(FieldValidationType)

    return Object.fromEntries(validationTypes.map((key) => (
      [key, getItems(validation[key])]
    )))
  }, [validation])

  const getTablePageByRow = useCallback((row) => (
    Math.floor(row / rowsPerChunk) + 1
  ), [rowsPerChunk])

  const cellsValidationConfig = useMemo(() => {
    if (!validation) {
      return null
    }

    const getItems = (items) => items?.filter((e) =>
      e.row !== null &&
      e.column !== null,
    )

    const validationTypes = Object.values(FieldValidationType)

    const validationConfig = Object.fromEntries(validationTypes.map(
      (key) => [key, getItems(validation[key])],
    ))

    if (
      ENV.FEATURE_PAGINATED_TABLES &&
      isTablePaginated &&
      FieldValidation.hasIssues(validationConfig)
    ) {
      const addPagePrefixToMessage = (items) => items.map((e) => ({
        ...e,
        message: `${localize(Localization.PAGE)} ${getTablePageByRow(e.row)}: ${e.message}`,
      }))

      return Object.entries(validationConfig).reduce((acc, [type, issues]) => {
        acc[type] = issues && addPagePrefixToMessage(issues)
        return acc
      }, {})
    }

    return validationConfig
  }, [
    getTablePageByRow,
    isTablePaginated,
    validation,
  ])

  const FieldActionsMenu = useMemo(() => (
    !renderActions
      ? (
        <TableEdFieldActionsMenu
          disabled={disabled}
          dtField={dtField}
          edField={edField}
        />
      )
      : renderActions()
  ),
  [renderActions, disabled, dtField, edField])

  const goToPage = useCallback((e) => {
    const { value } = e.target
    const maxPage = Math.ceil(edField.data.meta.rowsTotal / rowsPerChunk)

    if (value < MIN_ROWS_CHUNK || value >= maxPage) {
      return setRowsChunk(maxPage)
    }

    setRowsChunk(+value)
  }, [edField, rowsPerChunk])

  const Label = useMemo(() => {
    if (renderLabel) {
      return renderLabel(dtField)
    }

    return (
      <FieldLabel
        name={dtField.name}
        required={dtField.required}
      />
    )
  }, [
    dtField,
    renderLabel,
  ])

  const showValidationResult = FieldValidation.hasIssues(validation)

  const reorderedValidationResult = useMemo(() => (
    Object.values(FieldValidationType).reduce((acc, key) => {
      acc[key] = [
        ...(tableValidationConfig?.[key] ?? []),
        ...(cellsValidationConfig?.[key] ?? []),
      ]
      return acc
    }, {})
  ), [
    cellsValidationConfig,
    tableValidationConfig,
  ])

  return (
    <FieldWrapper>
      <InView id={id}>
        <InfoWrapper>
          {Label}
          <InfoWrapperCell>
            <CoordsHighlightTrigger
              edField={edField}
              highlightArea={highlightArea}
              setHighlightedField={setHighlightedField}
            />
            <Flags
              comments={edField?.comments}
              modifiedBy={edField?.data?.modifiedBy}
            />
            {FieldActionsMenu}
          </InfoWrapperCell>
        </InfoWrapper>
        <ExtractedDataTable
          disabled={disabled}
          dtField={dtField}
          edField={edField}
          goToPage={goToPage}
          isChunkFetching={isChunkFetching}
          isChunkShouldBeFetched={isChunkShouldBeFetched}
          isPaginationDisplayed={isPaginationDisplayed}
          paginationChangeHandler={paginationChangeHandler}
          rowsChunk={rowsChunk}
          rowsPerChunk={rowsPerChunk}
          validation={validation}
        />
        {
          showValidationResult && (
            <FieldValidationResult
              validation={reorderedValidationResult}
            />
          )
        }
      </InView>
    </FieldWrapper>
  )
}

const mapDispatchToProps = {
  fetchPaginatedEdTable,
}

const ConnectedComponent = connect(null, mapDispatchToProps)(TableEdField)

TableEdField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  edField: extractedDataFieldShape.isRequired,
  id: PropTypes.string,
  validation: fieldValidationShape,
  renderActions: PropTypes.func,
  fetchPaginatedEdTable: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  renderLabel: PropTypes.func,
}

export {
  ConnectedComponent as TableEdField,
}
