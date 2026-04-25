
import lodashDebounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { InputNumber } from '@/components/InputNumber'
import { Tooltip } from '@/components/Tooltip'
import { EditTableFieldButton } from '@/containers/PrototypeTables/EditTableFieldButton'
import { MappingHeaders } from '@/containers/PrototypeTables/MappingHeaders'
import { Localization, localize } from '@/localization/i18n'
import { TableFieldColumn, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { prototypeTableFieldShape } from '@/models/PrototypeTableField'
import {
  Wrapper,
  FirstRowWrapper,
  NameInput,
  DeleteIconButton,
  SecondRowWrapper,
} from './TableFieldCard.styles'

const MAX_INPUT_LENGTH = 50
const DEBOUNCE_TIME = 300

const TableFieldCard = ({
  field,
  removeField,
  updateField,
  isEditMode,
}) => {
  const { name, tabularMapping } = field

  const [nameInputVal, setNameInputVal] = useState(name)
  const [occurrenceIdxInputVal, setOccurrenceIdxInputVal] = useState(tabularMapping.occurrenceIndex)

  const isReadOnlyMode = !isEditMode

  const debouncedUpdateField = useMemo(
    () => lodashDebounce(
      (updatedField) => updateField(updatedField),
      DEBOUNCE_TIME,
    ), [updateField])

  useEffect(() => {
    setNameInputVal(field.name)
    setOccurrenceIdxInputVal(field.tabularMapping.occurrenceIndex)
  }, [
    field.name,
    field.tabularMapping.occurrenceIndex,
  ])

  const handleFieldNameChange = (e) => {
    const name = e.target.value

    setNameInputVal(name)
    debouncedUpdateField({
      ...field,
      name,
    })
  }

  const handleOccurrenceIndexChange = (val) => {
    setOccurrenceIdxInputVal(val)
    debouncedUpdateField({
      ...field,
      tabularMapping: {
        ...field.tabularMapping,
        occurrenceIndex: val,
      },
    })
  }

  const handleUpdateHeaders = (headers) => {
    updateField({
      ...field,
      fieldType: {
        ...field.fieldType,
        description: new TableFieldMeta(
          headers.map((h) => new TableFieldColumn(h.name)),
        ),
      },
      tabularMapping: {
        ...field.tabularMapping,
        headers,
      },
    })
  }

  const deleteField = () => {
    removeField(field.id)
  }

  return (
    <Wrapper>
      <FirstRowWrapper>
        <NameInput
          disabled={isReadOnlyMode}
          maxLength={MAX_INPUT_LENGTH}
          onChange={handleFieldNameChange}
          placeholder={localize(Localization.ENTER_FIELD_NAME)}
          suffix={
            (
              <span>
                {tabularMapping.headerType}
              </span>
            )
          }
          value={nameInputVal}
        />
        <Tooltip title={localize(Localization.OCCURRENCE_INDEX)}>
          <InputNumber
            addonBefore={'#'}
            disabled={isReadOnlyMode}
            onChange={handleOccurrenceIndexChange}
            value={occurrenceIdxInputVal}
          />
        </Tooltip>
        {
          isEditMode && (
            <DeleteIconButton
              icon={<XMarkIcon />}
              onClick={deleteField}
            />
          )
        }
      </FirstRowWrapper>
      <SecondRowWrapper>
        <MappingHeaders
          isEditMode={isEditMode}
          tabularMapping={tabularMapping}
          updateHeaders={handleUpdateHeaders}
        />
        {
          isEditMode && (
            <EditTableFieldButton
              field={field}
              isEditMode={isEditMode}
              updateField={updateField}
            />
          )
        }
      </SecondRowWrapper>
    </Wrapper>
  )
}

TableFieldCard.propTypes = {
  field: prototypeTableFieldShape.isRequired,
  updateField: PropTypes.func.isRequired,
  removeField: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
}

export {
  TableFieldCard,
}
