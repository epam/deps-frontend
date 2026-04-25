
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import isRequiredIf from 'react-proptype-conditional-require'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { BatchFieldsSelection } from './BatchFieldsSelection'
import { FieldsList } from './FieldsList'
import {
  Wrapper,
  Header,
  Title,
} from './OutputProfileByExtractor.styles'
import { ProfileFieldsSearch } from './ProfileFieldsSearch'

const OutputProfileByExtractor = ({
  fields,
  isEditMode,
  profileFields,
  setProfileFields,
}) => {
  const mappedAndSortedFields = useMemo(() =>
    fields
      .map((field) => ({
        field,
        isInProfile: profileFields.includes(field.code),
      }))
      .sort((a, b) => {
        if (a.isInProfile !== b.isInProfile) {
          return a.isInProfile ? -1 : 1
        }

        if (a.isInProfile) {
          return profileFields.indexOf(a.field.code) - profileFields.indexOf(b.field.code)
        }

        return a.field.name.localeCompare(b.field.name)
      }),
  [
    fields,
    profileFields,
  ])

  const onFieldToggle = (fieldCode) => {
    profileFields.includes(fieldCode) ? excludeFields([fieldCode]) : includeFields([fieldCode])
  }

  const includeFields = (fieldsCodes) => {
    const fields = Array.from(new Set([...profileFields, ...fieldsCodes]))
    setProfileFields(fields)
  }

  const excludeFields = (fieldsCodes) => {
    const fields = profileFields.filter((f) => !fieldsCodes.includes(f))
    setProfileFields(fields)
  }

  return (
    <Wrapper>
      <Header>
        <Title>
          {localize(Localization.ALL_PROFILE_FIELDS)}
        </Title>
        <ProfileFieldsSearch
          fields={mappedAndSortedFields}
          isEditMode={isEditMode}
          onFieldToggle={onFieldToggle}
        />
      </Header>
      <BatchFieldsSelection
        excludeFields={excludeFields}
        fields={mappedAndSortedFields}
        includeFields={includeFields}
        isEditMode={isEditMode}
      />
      <FieldsList
        fields={mappedAndSortedFields}
        isEditMode={isEditMode}
        onFieldToggle={onFieldToggle}
        profileFields={profileFields}
        setProfileFields={setProfileFields}
      />
    </Wrapper>
  )
}

OutputProfileByExtractor.propTypes = {
  fields: PropTypes.arrayOf(
    documentTypeFieldShape.isRequired,
  ),
  isEditMode: PropTypes.bool,
  profileFields: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  setProfileFields: isRequiredIf(
    PropTypes.func,
    (props) => props.isEditMode,
  ),
}

export {
  OutputProfileByExtractor,
}
