
import { useMemo } from 'react'
import { useFetchLLMsQuery } from '@/apiRTK/LLMsApi'

const parseExtractorModelToProviderAndModel = (extractorModel) => {
  const [provider, model] = extractorModel.split('@')

  return {
    provider,
    model,
  }
}

export const useExtractorModel = (extractorModel) => {
  const {
    data = [],
    isFetching,
  } = useFetchLLMsQuery()

  const { providerName, modelName } = useMemo(() => {
    const { provider, model } = parseExtractorModelToProviderAndModel(extractorModel)

    const foundProvider = data.find((p) => p.code === provider)
    const foundModel = foundProvider?.models.find((m) => m.code === model)

    return {
      providerName: foundProvider?.name ?? provider,
      modelName: foundModel?.name ?? model,
    }
  }, [data, extractorModel])

  return {
    providerName,
    modelName,
    isFetching,
  }
}
