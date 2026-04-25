
import PropTypes from 'prop-types'
import { FieldType } from '@/enums/FieldType'

class DocumentTypeFieldMeta {
  constructor (
    charBlacklist = null,
    charWhitelist = null,
    displayCharLimit,
  ) {
    this.charBlacklist = charBlacklist
    this.charWhitelist = charWhitelist
    displayCharLimit !== undefined && (this.displayCharLimit = displayCharLimit)
  }
}

const fieldMetaShape = PropTypes.shape({
  charBlacklist: PropTypes.string,
  charWhitelist: PropTypes.string,
  displayCharLimit: PropTypes.number,
})

class EnumFieldMeta {
  constructor (
    options = [],
  ) {
    this.options = options
  }
}

const enumFieldMetaShape = PropTypes.shape({
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
})

class DictFieldMeta {
  constructor (
    keyMeta = new DocumentTypeFieldMeta(),
    keyType = FieldType.STRING,
    valueMeta = new DocumentTypeFieldMeta(),
    valueType = FieldType.STRING,
  ) {
    this.keyMeta = keyMeta
    this.keyType = keyType
    this.valueMeta = valueMeta
    this.valueType = valueType
  }
}

const dictFieldMetaShape = PropTypes.shape({
  keyMeta: fieldMetaShape.isRequired,
  keyType: PropTypes.oneOf(Object.values(FieldType)).isRequired,
  valueMeta: fieldMetaShape.isRequired,
  valueType: PropTypes.oneOf(Object.values(FieldType)).isRequired,
})

class ListFieldMeta {
  constructor (baseType, baseTypeMeta) {
    this.baseType = baseType
    this.baseTypeMeta = baseTypeMeta
  }
}

const listFieldMetaShape = PropTypes.shape({
  baseType: PropTypes.oneOf(Object.values(FieldType)).isRequired,
  baseTypeMeta: PropTypes.oneOfType([
    dictFieldMetaShape,
    enumFieldMetaShape,
    fieldMetaShape,
  ]),
})

class TableFieldColumn {
  constructor (title, columnType = FieldType.STRING, columnMeta) {
    this.title = title
    this.columnType = columnType
    this.columnMeta = columnMeta
  }
}

const tableFieldColumnShape = PropTypes.shape({
  title: PropTypes.string,
  columnType: PropTypes.string,
  columnMeta: fieldMetaShape,
})

class TableFieldMeta {
  constructor (columns) {
    this.columns = columns
  }
}

const tableFieldMetaShape = PropTypes.shape({
  columns: PropTypes.arrayOf(
    tableFieldColumnShape,
  ),
})

export {
  enumFieldMetaShape,
  DocumentTypeFieldMeta,
  EnumFieldMeta,
  DictFieldMeta,
  ListFieldMeta,
  fieldMetaShape,
  dictFieldMetaShape,
  listFieldMetaShape,
  tableFieldMetaShape,
  TableFieldMeta,
  TableFieldColumn,
}
