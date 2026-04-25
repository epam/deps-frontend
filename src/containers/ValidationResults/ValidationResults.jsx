
import PropTypes from 'prop-types'
import { batch, connect } from 'react-redux'
import { changeActiveTab, setActiveField } from '@/actions/documentReviewPage'
import { setScrollId } from '@/actions/navigation'
import { Badge } from '@/components/Badge'
import { Dropdown } from '@/components/Dropdown'
import { CircleExclamationIcon } from '@/components/Icons/CircleExclamationIcon'
import { ErrorIcon } from '@/components/Icons/ErrorIcon'
import { WarningTriangleIcon as WarningIcon } from '@/components/Icons/WarningTriangleIcon'
import { MenuTrigger } from '@/components/Menu'
import { getSeparatedId } from '@/containers/InView'
import { ComponentSize } from '@/enums/ComponentSize'
import { FieldType } from '@/enums/FieldType'
import { GROUPING_TYPE } from '@/enums/GroupingTypeTabs'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { DocumentType, documentTypeShape } from '@/models/DocumentType'
import { FieldValidationType, KvId } from '@/models/DocumentValidation'
import { ExtractedData, ExtractedDataField } from '@/models/ExtractedData'
import {
  documentSelector,
  documentTypeSelector,
  fieldsGroupingSelector,
} from '@/selectors/documentReviewPage'
import { theme } from '@/theme/theme.default'
import {
  MenuItem,
  CountFlag,
  KeyValueFlag,
  MenuItemGroup,
  TitleWithIcon,
  SubMenu,
  Menu,
  Button,
} from './ValidationResults.styles'

const mapKeyToIcon = {
  [FieldValidationType.ERRORS]: <ErrorIcon />,
  [FieldValidationType.WARNINGS]: <WarningIcon />,
}

const ValidationResults = ({
  changeActiveTab,
  document,
  documentType,
  fieldsGrouping,
  setActiveField,
  setScrollId,
}) => {
  const MAP_FIELD_GROUPING_TO_ACTIVE_TAB_GETTER = {
    [GROUPING_TYPE.BY_PAGE]: (data) => ExtractedDataField.getPagesFromFieldData(data),
    [GROUPING_TYPE.SET_INDEX]: (data) => ExtractedDataField.getSetIndexes(data, document),
  }

  const fieldsWithErrors = document.validation?.detail?.filter((field) => !!field.errors.length || !!field.crossFieldErrors?.length)
  const fieldsWithWarnings = document.validation?.detail?.filter((field) => !!field.warnings.length || !!field.crossFieldWarnings?.length)
  const getFieldName = (field) => documentType.fields.find((f) => f.code === field.fieldCode).name
  const getFieldPk = (field) => DocumentType.getPkByCode(documentType, field.fieldCode)
  const getEdField = (field) => ExtractedData.getFieldByPk(document.extractedData, getFieldPk(field)) || {}
  const getActiveTab = (field, index) => {
    const { data } = getEdField(field)

    if (!data) {
      return NaN
    }

    const getTabs = MAP_FIELD_GROUPING_TO_ACTIVE_TAB_GETTER[fieldsGrouping]

    let activeTab

    if (index || index === 0) {
      [activeTab] = getTabs(data[index])
    } else {
      [activeTab] = getTabs(data)
    }

    return activeTab
  }

  const onFieldClick = (field, index) => {
    if (fieldsGrouping !== GROUPING_TYPE.USER_DEFINED) {
      const activeTab = getActiveTab(field, index)

      changeActiveTab(String(activeTab))
    }

    batch(() => {
      setActiveField(getFieldPk(field))
      setScrollId(getSeparatedId(field.fieldCode, index))
    })
  }

  const renderTitle = (field, key, index) => (
    <TitleWithIcon>
      { !index && index !== 0 && mapKeyToIcon[key] }
      { index || index === 0 ? `${getFieldName(field)} ${index + 1}` : getFieldName(field) }
    </TitleWithIcon>
  )

  const defaultRenderer = (field, key, index, extra) => (
    <MenuItem
      key={getSeparatedId(field.fieldCode, index)}
      $index={index}
      $section={key}
      onClick={() => onFieldClick(field, index)}
    >
      {renderTitle(field, key, index)}
      {extra && extra}
    </MenuItem>
  )

  const tableRenderer = (field, key, index) => {
    let cells = field[key].filter((item) => (item.column !== null) && (item.row !== null))
    if (index || index === 0) {
      cells = cells.filter((cell) => cell.index === index)
    }

    const uniqueCells = cells.filter(({ row, column }, index, self) => (
      self.findIndex((el) => el.row === row && el.column === column) === index
    ))
    const extra = uniqueCells?.length > 1 && <CountFlag>{uniqueCells.length}</CountFlag>
    return defaultRenderer(field, key, index, extra)
  }

  const kvRenderer = (field, key, index) => {
    const kv = field[key].reduce((acc, curr) => {
      if (curr.kvId === KvId.KEY) {
        acc.KEY.push(curr)
      } else {
        acc.VALUE.push(curr)
      }

      return acc
    }, {
      KEY: [],
      VALUE: [],
    })

    const extras = Object.keys(kv).map((key, index) => {
      if (!kv[key].length) {
        return
      }

      return <KeyValueFlag key={index}>{localize(Localization[key])}</KeyValueFlag>
    }).filter((item) => item)

    return extras.map((extra) => defaultRenderer(field, key, index, extra))
  }

  const listRenderer = (field, key) => {
    const { baseType } = documentType.fields.find((f) => f.code === field.fieldCode).fieldMeta
    const listItemsIndexes = field[key]?.filter((e) => e.index !== null).sort((a, b) => a.index - b.index).map((item) => item.index)
    const uniqueListItemsIndexes = [...new Set(listItemsIndexes)]
    const renderer = mapFieldTypeToRenderer[baseType] ?? defaultRenderer

    return uniqueListItemsIndexes?.length
      ? (
        <SubMenu
          key={`${field.fieldCode}${key}`}
          $section={key}
          icon={mapKeyToIcon[key]}
          popupClassName={'validation-submenu-wrapper'}
          title={getFieldName(field)}
        >
          {
            uniqueListItemsIndexes.map((index) => (
              renderer(field, key, index)
            ))
          }
        </SubMenu>
      )
      : defaultRenderer(field, key)
  }

  const mapFieldTypeToRenderer = {
    [FieldType.STRING]: defaultRenderer,
    [FieldType.TABLE]: tableRenderer,
    [FieldType.LIST]: listRenderer,
    [FieldType.DICTIONARY]: kvRenderer,
    [FieldType.CHECKMARK]: defaultRenderer,
    [FieldType.ENUM]: defaultRenderer,
  }

  const renderMenuItems = (fields, key) => fields.reduce((acc, field) => {
    const existedField = documentType.fields.find((f) => f.code === field.fieldCode)

    if (existedField) {
      const renderer = mapFieldTypeToRenderer[existedField.fieldType] ?? defaultRenderer
      acc.push(renderer(field, key))
    }

    return acc
  }, [])

  const renderDropdown = () => (
    <Menu trigger={MenuTrigger.CLICK}>
      {
        !!fieldsWithErrors?.length && (
          <MenuItemGroup title={localize(Localization.ERRORS)}>
            {
              renderMenuItems(fieldsWithErrors, FieldValidationType.ERRORS)
            }
          </MenuItemGroup>
        )
      }
      {
        !!fieldsWithWarnings?.length && (
          <MenuItemGroup title={localize(Localization.WARNINGS)}>
            {
              renderMenuItems(fieldsWithWarnings, FieldValidationType.WARNINGS)
            }
          </MenuItemGroup>
        )
      }
    </Menu>
  )

  if (!fieldsWithErrors?.length && !fieldsWithWarnings?.length) {
    return null
  }

  return (
    <Dropdown
      dropdownRender={renderDropdown}
      trigger={[MenuTrigger.CLICK]}
    >
      <Badge
        color={theme.color.error}
        count={fieldsWithErrors?.length}
        size={ComponentSize.SMALL}
      >
        <Button
          errors={fieldsWithErrors}
          warnings={fieldsWithWarnings}
        >
          <CircleExclamationIcon />
        </Button>
      </Badge>
    </Dropdown>
  )
}

const mapStateToProps = (state) => ({
  document: documentSelector(state),
  documentType: documentTypeSelector(state),
  fieldsGrouping: fieldsGroupingSelector(state),
})

const mapDispatchToProps = {
  changeActiveTab,
  setActiveField,
  setScrollId,
}

ValidationResults.propTypes = {
  changeActiveTab: PropTypes.func.isRequired,
  document: documentShape.isRequired,
  documentType: documentTypeShape.isRequired,
  fieldsGrouping: PropTypes.oneOf(
    Object.values(GROUPING_TYPE),
  ).isRequired,
  setActiveField: PropTypes.func.isRequired,
  setScrollId: PropTypes.func.isRequired,
}

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(ValidationResults)

export {
  ConnectedComponent as ValidationResults,
}
