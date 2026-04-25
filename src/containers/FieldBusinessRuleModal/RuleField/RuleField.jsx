
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { DateFieldIcon } from '@/components/Icons/DateFieldIcon'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { KeyValuePairFieldIcon } from '@/components/Icons/KeyValuePairFieldIcon'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { TableFieldIcon } from '@/components/Icons/TableFieldIcon'
import { MentionOption } from '@/components/MentionsField'
import { FieldType, RESOURCE_FIELD_TYPE, RESOURCE_FIELDS_TYPES } from '@/enums/FieldType'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import {
  InputTooltip,
  RequiredMark,
  RuleInput,
  SuggestionWrapper,
  SuggestionType,
  SuggestionIcon,
} from './RuleField.styles'

const REQUIRED_FIELD_MARKER = '*'
const BACKEND_TRIGGER_SYMBOL = 'F'
const DISPLAY_TRIGGER_SYMBOL = '$'
const DISPLAY_TRIGGER_REGEXP = new RegExp(`(\\${DISPLAY_TRIGGER_SYMBOL})([\\w]*)$`)
const BACKEND_UNBRACED_MENTION_REGEXP = new RegExp(`\\b${BACKEND_TRIGGER_SYMBOL}([a-zA-Z0-9]+)(?=[^a-zA-Z0-9]|$)`, 'g')
const BACKEND_BRACED_MENTION_REGEXP = new RegExp(`${BACKEND_TRIGGER_SYMBOL}\\{([\\w]+)\\}`, 'g')

const FIELD_TYPE_TO_ICON = {
  [FieldType.CHECKMARK]: <CheckboxFieldIcon />,
  [FieldType.STRING]: <StringFieldIcon />,
  [FieldType.DICTIONARY]: <KeyValuePairFieldIcon />,
  [FieldType.TABLE]: <TableFieldIcon />,
  [FieldType.ENUM]: <EnumFieldIcon />,
  [FieldType.DATE]: <DateFieldIcon />,
}

const stripNewLines = (value = '') => value.replace(/\r?\n|\r/g, '')

const denormalizeValue = (val = '') => (
  val.replace(BACKEND_BRACED_MENTION_REGEXP, `${BACKEND_TRIGGER_SYMBOL}$1`)
)

const normalizeBackendValue = (value = '', codeToNameMap) => (
  value.replace(
    BACKEND_UNBRACED_MENTION_REGEXP,
    (match, code) => (
      codeToNameMap[code]
        ? `${BACKEND_TRIGGER_SYMBOL}{${code}}`
        : match
    ),
  )
)

const RuleField = ({
  value = '',
  onChange,
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
      })
    ))
  ), [mentionFields])

  const codeToNameMap = useMemo(() => (
    Object.fromEntries(mentionFields.map(({ code, name }) => [code, name]))
  ), [mentionFields])

  const normalizedValue = useMemo(
    () => normalizeBackendValue(value, codeToNameMap),
    [codeToNameMap, value],
  )

  const renderSuggestion = useCallback((suggestion) => {
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
  }, [fieldsByCode])

  const handleChange = useCallback((_, newValue) => {
    onChange(stripNewLines(denormalizeValue(newValue)))
  }, [onChange])

  return (
    <InputTooltip
      placement={Placement.TOP_LEFT}
      title={!value ? localize(Localization.REQUIRED_FIELD) : ''}
    >
      <RuleInput
        $hasRequiredMark={!value}
        allowSpaceInQuery
        data={mentionsData}
        displayTransform={(id) => `${DISPLAY_TRIGGER_SYMBOL}${codeToNameMap[id]}`}
        markup={`${BACKEND_TRIGGER_SYMBOL}{__id__}`}
        onChange={handleChange}
        placeholder={localize(Localization.RULE_PLACEHOLDER)}
        renderSuggestion={renderSuggestion}
        trigger={DISPLAY_TRIGGER_REGEXP}
        value={normalizedValue}
      />
      {
        !value && (
          <RequiredMark>
            {REQUIRED_FIELD_MARKER}
          </RequiredMark>
        )
      }
    </InputTooltip>
  )
}

RuleField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  mentionFields: PropTypes.arrayOf(
    documentTypeFieldShape,
  ).isRequired,
}

export {
  RuleField,
}
