
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { DateFieldIcon } from '@/components/Icons/DateFieldIcon'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { KeyValuePairFieldIcon } from '@/components/Icons/KeyValuePairFieldIcon'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { TableFieldIcon } from '@/components/Icons/TableFieldIcon'
import { MentionOption } from '@/components/MentionsField'
import { FieldType, RESOURCE_FIELD_TYPE, RESOURCE_FIELDS_TYPES } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import {
  Input,
  SuggestionWrapper,
  SuggestionType,
  SuggestionIcon,
} from './IssueMessageField.styles'

const MENTION_TRIGGER = '$'

const FIELD_TYPE_TO_ICON = {
  [FieldType.CHECKMARK]: <CheckboxFieldIcon />,
  [FieldType.STRING]: <StringFieldIcon />,
  [FieldType.DICTIONARY]: <KeyValuePairFieldIcon />,
  [FieldType.TABLE]: <TableFieldIcon />,
  [FieldType.ENUM]: <EnumFieldIcon />,
  [FieldType.DATE]: <DateFieldIcon />,
}

const IssueMessageField = ({
  onChange,
  value,
  mentionFields,
}) => {
  const fieldsByCode = useMemo(() => (
    Object.fromEntries(mentionFields.map((f) => [f.code, f]))
  ), [mentionFields])

  const mentionsData = useMemo(() => (
    mentionFields.map((f) => (
      new MentionOption({
        id: f.code,
        display: f.name,
      })),
    )
  ), [mentionFields])

  const codeToNameMap = useMemo(() => (
    Object.fromEntries(mentionFields.map(({ code, name }) => [code, name]))
  ), [mentionFields])

  const renderSuggestion = (suggestion) => {
    const field = fieldsByCode[suggestion.id]
    if (!field) {
      return suggestion.display
    }

    const isList = field.fieldType === FieldType.LIST

    const typeKey = isList ? field.fieldMeta.baseType : field.fieldType

    const typeLabel = isList
      ? localize(Localization.LIST_OF, { value: RESOURCE_FIELDS_TYPES[typeKey] })
      : RESOURCE_FIELD_TYPE[typeKey]

    return (
      <SuggestionWrapper>
        <span>{field.name}</span>
        <SuggestionType>
          {typeLabel}
          <SuggestionIcon>
            {FIELD_TYPE_TO_ICON[typeKey]}
          </SuggestionIcon>
        </SuggestionType>
      </SuggestionWrapper>
    )
  }

  const handleChange = (_, newValue) => {
    onChange(newValue)
  }

  return (
    <Input
      allowSpaceInQuery
      allowSuggestionsAboveCursor
      data={mentionsData}
      displayTransform={(id) => `${MENTION_TRIGGER}${codeToNameMap[id]}`}
      markup={`${MENTION_TRIGGER}{__id__}`}
      onChange={handleChange}
      placeholder={localize(Localization.ISSUE_MESSAGE_PLACEHOLDER)}
      renderSuggestion={renderSuggestion}
      trigger={MENTION_TRIGGER}
      value={value || ''}
    />
  )
}

export {
  IssueMessageField,
}

IssueMessageField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  mentionFields: PropTypes.arrayOf(
    documentTypeFieldShape,
  ).isRequired,
}
