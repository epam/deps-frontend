
import PropTypes from 'prop-types'
import {
  useMemo,
  useCallback,
  useRef,
  useState,
} from 'react'
import { useParams } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import { ButtonType } from '@/components/Button'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'
import { NoData } from '@/components/NoData'
import { EmptyPrototypeFields } from '@/containers/EmptyPrototypeFields'
import { FieldsSearchInput } from '@/containers/FieldsSearchInput'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { Localization, localize } from '@/localization/i18n'
import {
  PrototypeField,
  PrototypeFieldMapping,
  PrototypeFieldType,
  prototypeFieldShape,
} from '@/models/PrototypeField'
import { EditableFieldCard } from './EditableFieldCard'
import {
  Wrapper,
  Header,
  Title,
  FieldsListWrapper,
  Button,
  Controls,
} from './PrototypeFields.styles'
import { ReadOnlyFieldCard } from './ReadOnlyFieldCard'

const renderAddNewFieldButton = (onClick) => (
  <Button
    onClick={onClick}
    type={ButtonType.PRIMARY}
  >
    <NewPlusIcon />
    {localize(Localization.ADD_NEW)}
  </Button>
)

const createNewField = (prototypeId) => new PrototypeField({
  id: uuidv4(),
  prototypeId,
  name: localize(Localization.NEW_FIELD),
  required: false,
  fieldType: new PrototypeFieldType({
    typeCode: FieldType.STRING,
    description: {},
  }),
  mapping: new PrototypeFieldMapping({
    keys: [localize(Localization.NEW_KEY)],
    mappingDataType: FieldType.STRING,
    mappingType: MappingType.ONE_TO_ONE,
  }),
})

const scrollToElement = (el) => {
  setTimeout(() => {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
  })
}

const PrototypeFields = ({
  addField,
  fieldsColumnsCount,
  fields,
  checkIfFieldIsSaved,
  isEditMode,
  removeField,
  toggleEditMode,
  updatePrototypeField,
}) => {
  const { id: prototypeId } = useParams()
  const [searchValue, setSearchValue] = useState('')

  const ref = useRef(null)

  const filteredFields = useMemo(() => {
    if (!searchValue) {
      return fields
    }

    return fields.filter(({ name, mapping }) => {
      const valuesToSearchIn = [name, ...mapping.keys]

      return valuesToSearchIn.some((value) => value.toLowerCase().includes(searchValue.toLowerCase()))
    })
  }, [
    searchValue,
    fields,
  ])

  const addNewField = useCallback(() => {
    const newField = createNewField(prototypeId)

    !isEditMode && toggleEditMode()

    addField(newField)
    ref.current && scrollToElement(ref.current)
  }, [
    addField,
    isEditMode,
    prototypeId,
    toggleEditMode,
  ])

  const PrototypeFieldsContent = useMemo(() => {
    if (!fields.length) {
      return (
        <EmptyPrototypeFields
          renderExtra={() => renderAddNewFieldButton(addNewField)}
        />
      )
    }

    if (!filteredFields.length) {
      return (
        <NoData />
      )
    }

    return (
      <FieldsListWrapper
        ref={ref}
        fieldsColumnsCount={fieldsColumnsCount}
      >
        {
          filteredFields.map((field) => isEditMode ? (
            <EditableFieldCard
              key={field.id}
              field={field}
              isSaved={!!checkIfFieldIsSaved?.(field)}
              removeField={removeField}
              updatePrototypeField={updatePrototypeField}
            />
          ) : (
            <ReadOnlyFieldCard
              key={field.id}
              field={field}
            />
          ))
        }
      </FieldsListWrapper>
    )
  }, [
    addNewField,
    fields,
    fieldsColumnsCount,
    filteredFields,
    isEditMode,
    removeField,
    updatePrototypeField,
    checkIfFieldIsSaved,
  ])

  return (
    <Wrapper>
      <Header>
        <Title>
          {localize(Localization.LIST_OF_FIELDS)}
        </Title>
        <Controls>
          {
            !!fields.length && (
              <FieldsSearchInput
                onChange={setSearchValue}
                placeholder={localize(Localization.SEARCH_FIELD)}
              />
            )
          }
          {
            isEditMode && !!fields.length &&
            renderAddNewFieldButton(addNewField)
          }
        </Controls>
      </Header>
      {PrototypeFieldsContent}
    </Wrapper>
  )
}

PrototypeFields.propTypes = {
  addField: PropTypes.func.isRequired,
  fieldsColumnsCount: PropTypes.number.isRequired,
  fields: PropTypes.arrayOf(
    prototypeFieldShape.isRequired,
  ).isRequired,
  checkIfFieldIsSaved: PropTypes.func,
  isEditMode: PropTypes.bool.isRequired,
  removeField: PropTypes.func.isRequired,
  toggleEditMode: PropTypes.func,
  updatePrototypeField: PropTypes.func.isRequired,
}

export {
  PrototypeFields,
}
