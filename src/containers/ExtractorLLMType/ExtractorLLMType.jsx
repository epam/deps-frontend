
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useFetchLLMsQuery } from '@/apiRTK/LLMsApi'
import { Spin } from '@/components/Spin'
import { localize, Localization } from '@/localization/i18n'
import { llmReferenceShape } from '@/models/LLMExtractor'
import { LLMSettings } from '@/models/LLMProvider'
import { notifyWarning } from '@/utils/notification'

const ExtractorLLMType = ({
  llmReference,
  render,
}) => {
  const { provider, model } = llmReference
  const {
    data: providers = [],
    isError,
    isFetching,
  } = useFetchLLMsQuery({
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (isError) {
      notifyWarning(localize(Localization.FETCH_LLMS_FAILURE_MESSAGE))
    }
  }, [isError])

  if (isFetching) {
    return (
      <Spin.Centered spinning />
    )
  }

  const displayedName = LLMSettings.getDisplayedLLMType(provider, model, providers)

  return displayedName && render(displayedName)
}

ExtractorLLMType.propTypes = {
  llmReference: llmReferenceShape.isRequired,
  render: PropTypes.func.isRequired,
}

export {
  ExtractorLLMType,
}
