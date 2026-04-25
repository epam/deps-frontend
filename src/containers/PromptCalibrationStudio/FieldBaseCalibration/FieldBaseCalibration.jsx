
import isEqual from 'lodash/isEqual'
import isNil from 'lodash/isNil'
import { useEffect, useState } from 'react'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { FieldName } from '../FieldName'
import { useFieldCalibration, useRetrieveInsights } from '../hooks'
import { InsightsComparison } from '../InsightsComparison'
import { InsightsErrorBoundary } from '../InsightsErrorBoundary'
import {
  InsightsParseError,
  mapResponseValue,
  mapNodesToRequestedInsights,
} from '../mappers'
import { extractorShape, fieldShape, Query } from '../viewModels'
import { Wrapper, FieldNameWrapper } from './FieldBaseCalibration.styles'
import { FieldFooter } from './FieldFooter'
import { UserPrompt } from './UserPrompt'

export const FieldBaseCalibration = ({ field, llmExtractor }) => {
  const {
    activeField,
    setActiveField,
  } = useFieldCalibration()

  const [prompt, setPrompt] = useState(activeField?.query.nodes[0]?.prompt)
  const [hasInsightsError, setHasInsightsError] = useState(false)
  const [executionIndex, setExecutionIndex] = useState(0)

  const executedValue = activeField?.query.value

  useEffect(() => {
    setHasInsightsError(false)
    setExecutionIndex(0)
  }, [field.id])

  const [
    retrieveInsights,
    isRetrievingInsights,
  ] = useRetrieveInsights()

  const updateActiveField = (userPrompt, extractedData) => {
    const { value, reasoning } = extractedData

    const query = Query.createQueryWithOneNode(userPrompt, value, reasoning)

    setActiveField({
      ...activeField,
      query,
    })
  }

  const onExecuteHandler = async () => {
    setHasInsightsError(false)

    try {
      const requestedInsights = mapNodesToRequestedInsights(field, [{ prompt }])
      const {
        model,
        customInstruction,
        ...params
      } = llmExtractor

      const elements = await retrieveInsights({
        model,
        customInstructions: customInstruction,
        requestedInsights,
        params,
      }).unwrap()

      const elementData = elements[field.id]

      if (elementData.errorOccurred) {
        notifyWarning(elementData.content)
        return
      }

      const extractedData = mapResponseValue(elementData.content)
      updateActiveField(prompt, extractedData)
      setExecutionIndex((prev) => prev + 1)
    } catch (e) {
      if (InsightsParseError.isInsightsParseError(e)) {
        setHasInsightsError(true)
        return
      }

      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)

      notifyWarning(message)
    }
  }

  const hasExecutedValue = !isNil(executedValue)
  const isExecutedValueChanged = hasExecutedValue && !isEqual(field?.value, executedValue)
  const isPromptChanged = prompt !== activeField?.query?.nodes[0]?.prompt

  return (
    <Wrapper>
      <FieldNameWrapper>
        <FieldName />
      </FieldNameWrapper>
      <InsightsErrorBoundary
        key={executionIndex}
        onError={setHasInsightsError}
      >
        <InsightsComparison
          executedValue={executedValue}
          field={field}
        />
      </InsightsErrorBoundary>
      <UserPrompt
        isLoading={isRetrievingInsights}
        onExecute={onExecuteHandler}
        prompt={prompt}
        setPrompt={setPrompt}
      />
      <FieldFooter
        hasInsightsError={hasInsightsError}
        isExecutedValueChanged={isExecutedValueChanged}
        isLoading={isRetrievingInsights}
        isPromptChanged={isPromptChanged}
      />
    </Wrapper>
  )
}

FieldBaseCalibration.propTypes = {
  field: fieldShape.isRequired,
  llmExtractor: extractorShape.isRequired,
}
