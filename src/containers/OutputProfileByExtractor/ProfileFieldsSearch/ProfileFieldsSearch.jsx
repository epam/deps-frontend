
import PropTypes from 'prop-types'
import {
  useMemo,
  useState,
  useCallback,
} from 'react'
import isRequiredIf from 'react-proptype-conditional-require'
import { Dropdown } from '@/components/Dropdown'
import { MenuTrigger } from '@/components/Menu'
import { NoData } from '@/components/NoData'
import { FieldsSearchInput } from '@/containers/FieldsSearchInput'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import {
  EmptyResultWrapper,
  ListWrapper,
  StyledProfileFieldCard,
} from './ProfileFieldsSearch.styles'

const ProfileFieldsSearch = ({
  fields,
  isEditMode,
  onFieldToggle,
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const onInputChange = useCallback((value) => {
    setIsVisible(!!value)
    setSearchValue(value)
  }, [
    setIsVisible,
    setSearchValue,
  ])

  const filteredFields = useMemo(() => {
    if (!searchValue) {
      return []
    }

    return fields.filter(({ field }) => field.name.toLowerCase()
      .includes(searchValue.toLowerCase()))
  }, [
    searchValue,
    fields,
  ])

  const renderDropdown = () => {
    if (!searchValue) {
      return <div />
    }

    if (!filteredFields.length) {
      return (
        <EmptyResultWrapper>
          <NoData />
        </EmptyResultWrapper>
      )
    }

    return (
      <ListWrapper>
        {
          filteredFields.map(({ field, isInProfile }) => (
            <StyledProfileFieldCard
              key={field.code}
              disabled={!isEditMode}
              field={field}
              isInProfile={isInProfile}
              onFieldToggle={onFieldToggle}
            />
          ))
        }
      </ListWrapper>
    )
  }

  return (
    <Dropdown
      destroyPopupOnHide={true}
      dropdownRender={renderDropdown}
      onOpenChange={setIsVisible}
      open={isVisible}
      trigger={[MenuTrigger.CLICK]}
    >
      <FieldsSearchInput
        onChange={onInputChange}
        shouldClear={!isVisible}
      />
    </Dropdown>
  )
}

ProfileFieldsSearch.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  onFieldToggle: isRequiredIf(
    PropTypes.func,
    (props) => props.isEditMode,
  ),
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      field: documentTypeFieldShape.isRequired,
      isInProfile: PropTypes.bool.isRequired,
    }),
  ).isRequired,
}

export {
  ProfileFieldsSearch,
}
