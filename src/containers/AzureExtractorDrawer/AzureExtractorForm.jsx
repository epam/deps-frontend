
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import {
  Form,
  FormItem,
  PatternValidator,
  MaxLengthValidator,
  RequiredValidator,
  FormFieldType,
} from '@/components/Form/ReactHookForm'
import { Input } from '@/components/Input'
import { Spin } from '@/components/Spin'
import { FORBIDDEN_WHITE_SPACE_BEFORE_TEXT } from '@/constants/regexp'
import { Localization, localize } from '@/localization/i18n'
import { AzureCredentials, azureExtractorShape } from '@/models/AzureExtractor'
import { AzureCredentialsValidator } from './AzureCredentialsValidator'
import {
  Wrapper,
  Title,
} from './AzureExtractorForm.styles'

const FIELD_PROPERTY = {
  NAME: 'name',
  LANGUAGE: 'language',
  MODEL_ID: 'modelId',
  API_KEY: 'apiKey',
  ENDPOINT: 'endpoint',
}

const AzureExtractorForm = ({
  extractorData,
  isConnectionDataLoading,
  setAreCredentialsValid,
}) => {
  const modelId = useWatch({
    name: FIELD_PROPERTY.MODEL_ID,
    defaultValue: extractorData?.credentials.modelId,
  })

  const endpoint = useWatch({
    name: FIELD_PROPERTY.ENDPOINT,
    defaultValue: extractorData?.credentials.endpoint,
  })

  const apiKey = useWatch({
    name: FIELD_PROPERTY.API_KEY,
  })

  const baseFields = useMemo(() => [
    {
      code: FIELD_PROPERTY.NAME,
      disabled: !!extractorData?.name,
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
      defaultValue: extractorData?.name,
    },
    {
      code: FIELD_PROPERTY.LANGUAGE,
      disabled: true,
      hint: localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR_LANGUAGE_HINT),
      label: localize(Localization.LANGUAGE),
      type: FormFieldType.STRING,
    },
  ], [extractorData?.name])

  const connectionDataFields = useMemo(() => [
    {
      code: FIELD_PROPERTY.MODEL_ID,
      label: localize(Localization.MODEL_ID),
      placeholder: localize(Localization.ENTER_MODEL),
      requiredMark: true,
      type: FormFieldType.STRING,
      rules: {
        ...new RequiredValidator(),
        ...new PatternValidator(
          FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
          localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
        ),
        ...new MaxLengthValidator(),
      },
      defaultValue: extractorData?.credentials.modelId,
    },
    {
      code: FIELD_PROPERTY.ENDPOINT,
      label: localize(Localization.ENDPOINT),
      placeholder: localize(Localization.ENTER_LINK),
      requiredMark: true,
      type: FormFieldType.STRING,
      rules: {
        ...new RequiredValidator(),
        ...new PatternValidator(
          FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
          localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
        ),
        ...new MaxLengthValidator(),
      },
      defaultValue: extractorData?.credentials.endpoint,
    },
    {
      code: FIELD_PROPERTY.API_KEY,
      label: localize(Localization.API_KEY),
      hint: localize(Localization.API_KEY_HINT),
      placeholder: localize(Localization.ENTER_KEY),
      requiredMark: true,
      render: (props) => (
        <Input.Password {...props} />
      ),
      rules: {
        ...new RequiredValidator(),
        ...new PatternValidator(
          FORBIDDEN_WHITE_SPACE_BEFORE_TEXT,
          localize(Localization.WHITE_SPACE_VALIDATOR_ERROR_MESSAGE),
        ),
        ...new MaxLengthValidator(),
      },
    },
  ], [extractorData])

  const BaseFormSection = useMemo(() => (
    baseFields.map(({ label, requiredMark, ...field }) => (
      <FormItem
        key={field.code}
        field={field}
        label={label}
        requiredMark={requiredMark}
      />
    ))
  ), [baseFields])

  const ConnectionDataSection = useMemo(() => {
    if (isConnectionDataLoading) {
      return (
        <Wrapper>
          <Title>{localize(Localization.CONNECTION_DATA)}</Title>
          <Spin.Centered spinning />
        </Wrapper>
      )
    }

    return (
      <Wrapper>
        <Title>{localize(Localization.CONNECTION_DATA)}</Title>
        {
          connectionDataFields.map(({ label, requiredMark, ...field }) => (
            <FormItem
              key={field.code}
              field={field}
              label={label}
              requiredMark={requiredMark}
            />
          ))
        }
        <AzureCredentialsValidator
          credentials={
            new AzureCredentials({
              apiKey,
              endpoint,
              modelId,
            })
          }
          setAreCredentialsValid={setAreCredentialsValid}
        />
      </Wrapper>
    )
  }, [
    apiKey,
    endpoint,
    modelId,
    connectionDataFields,
    isConnectionDataLoading,
    setAreCredentialsValid,
  ])

  return (
    <Form>
      { BaseFormSection }
      { ConnectionDataSection }
    </Form>
  )
}

AzureExtractorForm.propTypes = {
  extractorData: azureExtractorShape,
  isConnectionDataLoading: PropTypes.bool,
  setAreCredentialsValid: PropTypes.func.isRequired,
}

export {
  AzureExtractorForm,
}
