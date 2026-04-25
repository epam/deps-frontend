
import PropTypes from 'prop-types'
import { useMemo, Fragment } from 'react'
import { ExtractorLLMType } from '@/containers/ExtractorLLMType'
import { useExpandableText } from '@/hooks/useExpandableText'
import { Localization, localize } from '@/localization/i18n'
import {
  EXTRACTION_PARAMS_KEYS,
  EXTRACTION_PARAMS_KEYS_TO_LABELS,
  llmExtractorShape,
} from '@/models/LLMExtractor'
import { LLMExtractorCommandBar } from '../LLMExtractorCommandBar'
import {
  Badge,
  BaseFieldsWrapper,
  Details,
  ExtractionName,
  ExtractionParam,
  ExtractionParamsWrapper,
  HorizontalDivider,
  InstructionText,
  Wrapper,
  VerticalDivider,
  ExpandCollapseIconWrapper,
} from './LLMExtractorCard.styles'

const formatPageRange = (range) => {
  if (!range) {
    return localize(Localization.ALL_PAGES)
  }

  return `${range.start} — ${range.end}`
}

const getExtractionParameter = (code, value) => {
  const displayedValue = code === EXTRACTION_PARAMS_KEYS.PAGE_SPAN
    ? formatPageRange(value)
    : value

  return (
    <ExtractionParam>
      {EXTRACTION_PARAMS_KEYS_TO_LABELS[code]}
      <span>{displayedValue}</span>
    </ExtractionParam>
  )
}

const LLMExtractorCard = ({
  documentTypeId,
  llmExtractor,
  refreshData,
}) => {
  const { ExpandableContainer, ToggleExpandIcon } = useExpandableText()

  const ExtractionParams = useMemo(() => {
    const parameters = Object.values(EXTRACTION_PARAMS_KEYS)

    return (
      <ExtractionParamsWrapper>
        {
          parameters.map((key, index) => (
            <Fragment key={key}>
              {getExtractionParameter(key, llmExtractor.extractionParams[key])}
              {
                index !== parameters.length - 1 &&
                <VerticalDivider />
              }
            </Fragment>
          ))
        }
      </ExtractionParamsWrapper>
    )
  }, [llmExtractor.extractionParams])

  const BaseFields = useMemo(() => (
    <BaseFieldsWrapper>
      <ExtractionName>
        {llmExtractor.name}
      </ExtractionName>
      {ExtractionParams}
    </BaseFieldsWrapper>
  ), [
    llmExtractor.name,
    ExtractionParams,
  ])

  const renderLLMType = (extractorName) => (
    <Badge>
      {extractorName}
    </Badge>
  )

  return (
    <Wrapper>
      <Details>
        {BaseFields}
        <ExtractorLLMType
          llmReference={llmExtractor.llmReference}
          render={renderLLMType}
        />
        <VerticalDivider />
        <LLMExtractorCommandBar
          documentTypeId={documentTypeId}
          llmExtractor={llmExtractor}
          refreshData={refreshData}
        />
      </Details>
      <HorizontalDivider />
      <div>
        <ExpandableContainer>
          <InstructionText>
            {llmExtractor.extractionParams.customInstruction}
          </InstructionText>
        </ExpandableContainer>
        <ExpandCollapseIconWrapper>
          <ToggleExpandIcon />
        </ExpandCollapseIconWrapper>
      </div>
    </Wrapper>
  )
}

LLMExtractorCard.propTypes = {
  documentTypeId: PropTypes.string.isRequired,
  llmExtractor: llmExtractorShape.isRequired,
  refreshData: PropTypes.func.isRequired,
}

export {
  LLMExtractorCard,
}
