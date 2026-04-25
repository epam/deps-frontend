
import { CircleExclamationIcon } from '@/components/Icons/CircleExclamationIcon'
import { LongText } from '@/components/LongText'
import { Popover, PopoverTrigger } from '@/components/Popover'
import { getTooltipConfig, parsePageSpanToContent } from '@/containers/PromptCalibrationStudio/utils'
import { Localization, localize } from '@/localization/i18n'
import { useFieldCalibration, useExtractorModel } from '../hooks'
import {
  EXTRACTOR_SETTINGS_TO_LABEL,
  ExtractorSettings,
} from './constants'
import {
  IconButton,
  Label,
  StyledList,
  StyledItem,
} from './LLMExtractorInfo.styles'

export const LLMExtractorInfo = () => {
  const { activeField, extractors } = useFieldCalibration()
  const extractor = extractors.find((extractor) => extractor.id === activeField.extractorId)

  const { providerName, modelName } = useExtractorModel(extractor.model)

  const extractorSettings = [
    {
      key: ExtractorSettings.MODEL,
      label: EXTRACTOR_SETTINGS_TO_LABEL[ExtractorSettings.MODEL],
      value: (
        <LongText
          text={`${modelName} / ${providerName}`}
        />
      ),
    },
    {
      key: ExtractorSettings.TEMPERATURE,
      label: EXTRACTOR_SETTINGS_TO_LABEL[ExtractorSettings.TEMPERATURE],
      value: extractor.temperature ?? '-',
    },
    {
      key: ExtractorSettings.GROUPING_FACTOR,
      label: EXTRACTOR_SETTINGS_TO_LABEL[ExtractorSettings.GROUPING_FACTOR],
      value: extractor.groupingFactor ?? '-',
    },
    {
      key: ExtractorSettings.PAGE_SPAN,
      label: EXTRACTOR_SETTINGS_TO_LABEL[ExtractorSettings.PAGE_SPAN],
      value: (
        <LongText
          text={parsePageSpanToContent(extractor.pageSpan)}
        />
      ),
    },
    {
      key: ExtractorSettings.TOP_P,
      label: EXTRACTOR_SETTINGS_TO_LABEL[ExtractorSettings.TOP_P],
      value: extractor.topP ?? '-',
    },
    {
      key: ExtractorSettings.CUSTOM_INSTRUCTION,
      label: EXTRACTOR_SETTINGS_TO_LABEL[ExtractorSettings.CUSTOM_INSTRUCTION],
      value: (
        <LongText
          text={extractor.customInstruction}
        />
      ),
    },
  ]

  const Content = (
    <StyledList>
      {
        extractorSettings.map(({ key, label, value }) => (
          <StyledItem key={key}>
            <Label>{label}</Label>
            {value}
          </StyledItem>
        ))
      }
    </StyledList>
  )

  return (
    <Popover
      content={Content}
      trigger={PopoverTrigger.CLICK}
    >
      <IconButton
        icon={<CircleExclamationIcon />}
        tooltip={getTooltipConfig(localize(Localization.LLM_EXTRACTOR_INFO))}
      />
    </Popover>
  )
}
