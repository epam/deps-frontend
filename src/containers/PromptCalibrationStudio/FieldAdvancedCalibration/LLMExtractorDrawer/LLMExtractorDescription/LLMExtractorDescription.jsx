
import { LongText } from '@/components/LongText'
import { Spin } from '@/components/Spin'
import { useExtractorModel } from '@/containers/PromptCalibrationStudio/hooks'
import { parsePageSpanToContent } from '@/containers/PromptCalibrationStudio/utils'
import { extractorShape } from '@/containers/PromptCalibrationStudio/viewModels'
import { localize, Localization } from '@/localization/i18n'
import {
  CustomInstructionItem,
  CustomInstructionItemValue,
  ExtractorSettingsItem,
  ExtractorSettingsItemLabel,
  ExtractorSettingsItemsWrapper,
  ExtractorSettingsItemValue,
} from './LLMExtractorDescription.styles'

export const LLMExtractorDescription = ({ extractor }) => {
  const {
    providerName,
    modelName,
    isFetching,
  } = useExtractorModel(extractor.model)

  if (isFetching) {
    return <Spin.Centered spinning />
  }

  return (
    <>
      <ExtractorSettingsItem>
        <ExtractorSettingsItemLabel>
          {localize(Localization.LLM_MODEL)}
        </ExtractorSettingsItemLabel>
        <ExtractorSettingsItemValue>
          <LongText
            key={modelName}
            text={modelName}
          />
          <LongText
            key={providerName}
            text={providerName}
          />
        </ExtractorSettingsItemValue>
      </ExtractorSettingsItem>
      <ExtractorSettingsItemsWrapper>
        <ExtractorSettingsItem>
          <ExtractorSettingsItemLabel>
            {localize(Localization.TEMPERATURE)}
          </ExtractorSettingsItemLabel>
          <ExtractorSettingsItemValue>
            {extractor.temperature}
          </ExtractorSettingsItemValue>
        </ExtractorSettingsItem>
        <ExtractorSettingsItem>
          <ExtractorSettingsItemLabel>
            {localize(Localization.TOP_P)}
          </ExtractorSettingsItemLabel>
          <ExtractorSettingsItemValue>
            {extractor.topP}
          </ExtractorSettingsItemValue>
        </ExtractorSettingsItem>
      </ExtractorSettingsItemsWrapper>
      <ExtractorSettingsItemsWrapper>
        <ExtractorSettingsItem>
          <ExtractorSettingsItemLabel>
            {localize(Localization.GROUPING_FACTOR)}
          </ExtractorSettingsItemLabel>
          <ExtractorSettingsItemValue>
            {extractor.groupingFactor}
          </ExtractorSettingsItemValue>
        </ExtractorSettingsItem>
        <ExtractorSettingsItem>
          <ExtractorSettingsItemLabel>
            {localize(Localization.PAGE_SPAN)}
          </ExtractorSettingsItemLabel>
          <ExtractorSettingsItemValue>
            {parsePageSpanToContent(extractor.pageSpan)}
          </ExtractorSettingsItemValue>
        </ExtractorSettingsItem>
      </ExtractorSettingsItemsWrapper>
      <CustomInstructionItem>
        <ExtractorSettingsItemLabel>
          {localize(Localization.CUSTOM_INSTRUCTION)}
        </ExtractorSettingsItemLabel>
        <CustomInstructionItemValue>
          {extractor.customInstruction}
        </CustomInstructionItemValue>
      </CustomInstructionItem>
    </>
  )
}

LLMExtractorDescription.propTypes = {
  extractor: extractorShape.isRequired,
}
