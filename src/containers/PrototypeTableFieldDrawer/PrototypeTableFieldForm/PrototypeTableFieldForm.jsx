
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import {
  Form,
  FormItem,
  PatternValidator,
  RequiredValidator,
  FormFieldType,
  MaxLengthValidator,
} from '@/components/Form/ReactHookForm'
import { NumberStepper } from '@/components/NumberStepper'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { Localization, localize } from '@/localization/i18n'
import { TableHeaderType } from '@/models/PrototypeTableField'
import { activeTableSelector } from '@/selectors/prototypePage'
import { NotificationMessage } from '../NotificationMessage'
import { TableHeadersSection } from '../TableHeadersSection'
import { TableHeaderSwitch } from '../TableHeaderSwitch'
import { TableView } from '../TableView'
import {
  BaseFieldsWrapper,
  FieldsWrapper,
  Content,
} from './PrototypeTableFieldForm.styles'

const FIELDS_CODE = {
  NAME: 'name',
  HEADER_TYPE: 'headerType',
  OCCURRENCE_INDEX: 'occurrenceIndex',
  HEADERS: 'headers',
}

const PrototypeTableFieldForm = () => {
  const [prevHeaders, setPrevHeaders] = useState([])

  const { getValues } = useFormContext()
  const { headerType, headers = [] } = getValues()

  const {
    fields: headersList,
    append,
    move,
    remove,
  } = useFieldArray({
    name: FIELDS_CODE.HEADERS,
  })

  const activeTable = useSelector(activeTableSelector)

  const handleHeaderTypeChange = () => {
    remove([...Array(headersList.length).keys()])
    append(prevHeaders)
    const headersToSave = headers.map((header, i) => ({
      ...header,
      id: headersList[i].id,
    }))
    setPrevHeaders(headersToSave)
  }

  const baseFields = [
    {
      code: FIELDS_CODE.NAME,
      label: localize(Localization.NAME),
      requiredMark: true,
      type: FormFieldType.STRING,
      placeholder: localize(Localization.NAME_PLACEHOLDER),
      rules: {
        ...new RequiredValidator(),
        ...new PatternValidator(
          FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
          localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
        ),
        ...new MaxLengthValidator(),
      },
    },
    {
      code: FIELDS_CODE.HEADER_TYPE,
      defaultValue: TableHeaderType.COLUMNS,
      render: TableHeaderSwitch,
      handler: {
        onChange: handleHeaderTypeChange,
      },
    },
  ]

  const occurrenceIndexField = [{
    code: FIELDS_CODE.OCCURRENCE_INDEX,
    defaultValue: 0,
    label: localize(Localization.OCCURRENCE_INDEX),
    render: NumberStepper,
  }]

  const BaseFormSection = (
    <BaseFieldsWrapper>
      {
        baseFields.map(({ label, requiredMark, ...field }) => (
          <FormItem
            key={field.code}
            field={field}
            label={label}
            requiredMark={requiredMark}
          />
        ))
      }
    </BaseFieldsWrapper>
  )

  const OccurrenceIndexSection =
    occurrenceIndexField.map(({ label, requiredMark, ...field }) => (
      <FormItem
        key={field.code}
        field={field}
        label={label}
        requiredMark={requiredMark}
      />
    ))

  return (
    <Content>
      {
        activeTable && (
          <TableView
            addHeader={append}
            headerType={headerType}
            headersList={headersList}
            removeHeader={remove}
          />
        )
      }
      <Form>
        <FieldsWrapper>
          <NotificationMessage
            activeTable={activeTable}
          />
          { BaseFormSection }
          { OccurrenceIndexSection }
          <TableHeadersSection
            addHeaders={append}
            headerType={headerType}
            headersList={headersList}
            moveHeader={move}
            removeHeader={remove}
          />
        </FieldsWrapper>
      </Form>
    </Content>
  )
}

export {
  PrototypeTableFieldForm,
}
