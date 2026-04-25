
import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
import { useFetchLLMsQuery } from '@/apiRTK/LLMsApi'
import { LongText } from '@/components/LongText'
import { Spin } from '@/components/Spin'
import { localize, Localization } from '@/localization/i18n'
import { LLMSettings } from '@/models/LLMProvider'
import { notifyWarning } from '@/utils/notification'

const DocumentLLMType = ({ llmType }) => {
  const {
    data: providers = [],
    isFetching,
    isError,
  } = useFetchLLMsQuery({}, {
    skip: !llmType,
  })

  const displayedName = useMemo(() => {
    if (!LLMSettings.isLLMTypeFormatValid(llmType)) {
      const allModels = providers.flatMap((provider) => provider.models)
      const foundModel = allModels.find((model) => model.code === llmType)

      return foundModel?.name ?? ''
    }

    const { provider: providerCode, model: modelCode } = LLMSettings.llmTypeToSettings(llmType)

    return LLMSettings.getDisplayedLLMType(providerCode, modelCode, providers)
  }, [
    llmType,
    providers,
  ])

  useEffect(() => {
    isError && notifyWarning(localize(Localization.FETCH_LLMS_FAILURE_MESSAGE))
  }, [isError])

  if (isFetching) {
    return (
      <Spin.Centered spinning />
    )
  }

  return displayedName && (
    <LongText
      text={displayedName}
    />
  )
}

DocumentLLMType.propTypes = {
  llmType: PropTypes.string,
}

export {
  DocumentLLMType,
}
