
import PropTypes from 'prop-types'
import { useCallback, useMemo, useRef, useState } from 'react'
import { NoData } from '@/components/NoData'
import { EmptyPrototypeFields } from '@/containers/EmptyPrototypeFields'
import { FieldsSearchInput } from '@/containers/FieldsSearchInput'
import { Localization, localize } from '@/localization/i18n'
import { prototypeTableFieldShape } from '@/models/PrototypeTableField'
import { AddFieldButton } from './AddFieldButton'
import {
  Wrapper,
  Header,
  Title,
  Controls,
  FieldsListWrapper,
} from './PrototypeTables.styles'
import { TableFieldCard } from './TableFieldCard'

const scrollToElement = (el) => {
  setTimeout(() => {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    })
  })
}

const PrototypeTables = ({
  fields,
  fieldsColumnsCount,
  isEditMode,
  addField,
  removeField,
  updateField,
  toggleEditMode,
}) => {
  const [searchValue, setSearchValue] = useState('')

  const ref = useRef(null)

  const filteredFields = useMemo(() => {
    if (!searchValue) {
      return fields
    }

    return fields.filter(({ name, tabularMapping }) => {
      const valuesToSearchIn = [
        name,
        ...tabularMapping.headers.map(({ name }) => name),
      ]

      return valuesToSearchIn.some((value) => value.toLowerCase().includes(searchValue.toLowerCase()))
    })
  }, [
    searchValue,
    fields,
  ])

  const handleAddNewField = useCallback((data) => {
    addField(data)
    ref.current && scrollToElement(ref.current)
  }, [addField])

  const Content = useMemo(() => {
    if (!fields.length) {
      return (
        <EmptyPrototypeFields
          renderExtra={
            () => (
              <AddFieldButton
                addField={handleAddNewField}
                isEditMode={isEditMode}
                toggleEditMode={toggleEditMode}
              />
            )
          }
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
          filteredFields.map((field) => (
            <TableFieldCard
              key={field.id}
              field={field}
              isEditMode={isEditMode}
              removeField={removeField}
              updateField={updateField}
            />
          ))
        }
      </FieldsListWrapper>
    )
  }, [
    handleAddNewField,
    fields,
    fieldsColumnsCount,
    filteredFields,
    isEditMode,
    removeField,
    toggleEditMode,
    updateField,
  ])

  return (
    <Wrapper>
      <Header>
        <Title>
          {localize(Localization.LIST_OF_TABLES)}
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
            isEditMode && !!fields.length && (
              <AddFieldButton
                addField={handleAddNewField}
                isEditMode={isEditMode}
                toggleEditMode={toggleEditMode}
              />
            )
          }
        </Controls>
      </Header>
      {Content}
    </Wrapper>
  )
}

PrototypeTables.propTypes = {
  fields: PropTypes.arrayOf(
    prototypeTableFieldShape.isRequired,
  ).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  updateField: PropTypes.func.isRequired,
  addField: PropTypes.func.isRequired,
  removeField: PropTypes.func.isRequired,
  toggleEditMode: PropTypes.func,
  fieldsColumnsCount: PropTypes.number.isRequired,
}

export {
  PrototypeTables,
}
