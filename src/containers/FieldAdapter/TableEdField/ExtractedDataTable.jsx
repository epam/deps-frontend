
import PropTypes from 'prop-types'
import { Spin } from '@/components/Spin'
import { ExtractedDataHandsonTable } from '@/containers/ExtractedDataHandsonTable'
import { FieldPagination } from '@/containers/FieldPagination'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { FieldValidation, fieldValidationShape } from '@/models/DocumentValidation'
import { extractedDataFieldShape } from '@/models/ExtractedData'
import { TableEdFieldWrapper } from './TableEdField.styles'

const ExtractedDataTable = ({
  isChunkShouldBeFetched,
  dtField,
  disabled,
  edField,
  validation,
  isPaginationDisplayed,
  paginationChangeHandler,
  rowsPerChunk,
  isChunkFetching,
  rowsChunk,
  goToPage,
}) => {
  if (isChunkShouldBeFetched || isChunkFetching) {
    return <Spin spinning />
  }

  return (
    <TableEdFieldWrapper
      hasErrors={!!FieldValidation.getAllErrors(validation).length}
      hasWarnings={!!FieldValidation.getAllWarnings(validation).length}
    >
      <ExtractedDataHandsonTable
        dtField={dtField}
        pageSize={rowsPerChunk}
        readOnly={disabled}
        tableField={edField}
        validation={validation}
      />
      {
        isPaginationDisplayed && (
          <FieldPagination
            current={rowsChunk}
            goToPage={goToPage}
            onChange={paginationChangeHandler}
            pageSize={rowsPerChunk}
            showLessItems
            showSizeChanger
            total={edField.data.meta.rowsTotal}
          />
        )
      }
    </TableEdFieldWrapper>
  )
}

ExtractedDataTable.propTypes = {
  isChunkShouldBeFetched: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  validation: fieldValidationShape,
  dtField: documentTypeFieldShape.isRequired,
  edField: extractedDataFieldShape.isRequired,
  isPaginationDisplayed: PropTypes.bool.isRequired,
  paginationChangeHandler: PropTypes.func.isRequired,
  rowsPerChunk: PropTypes.number.isRequired,
  isChunkFetching: PropTypes.bool.isRequired,
  rowsChunk: PropTypes.number.isRequired,
  goToPage: PropTypes.func.isRequired,
}

export {
  ExtractedDataTable,
}
