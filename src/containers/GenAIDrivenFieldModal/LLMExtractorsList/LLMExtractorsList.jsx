
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { DownOutlined } from '@/components/Icons/DownOutlined'
import { ExtractorLLMType } from '@/containers/ExtractorLLMType'
import { Localization, localize } from '@/localization/i18n'
import {
  EXTRACTION_PARAMS_KEYS,
  EXTRACTION_PARAMS_KEYS_TO_LABELS,
  llmExtractorShape,
} from '@/models/LLMExtractor'
import {
  Collapse,
  ExtractionParamsWrapper,
  ExtractionParam,
  ExtractionName,
  HeaderWrapper,
  Instruction,
  LLMType,
  Panel,
  StyledIconButton,
} from './LLMExtractorsList.styles'

const formatPageRange = (range) => {
  if (!range) {
    return localize(Localization.ALL_PAGES)
  }

  return `${range.start} — ${range.end}`
}

const renderExtractionParams = (params) => (
  Object.values(EXTRACTION_PARAMS_KEYS).map((code) => {
    const value = params[code]
    const displayedValue = code === EXTRACTION_PARAMS_KEYS.PAGE_SPAN
      ? formatPageRange(value)
      : value

    return (
      <ExtractionParam key={code}>
        {EXTRACTION_PARAMS_KEYS_TO_LABELS[code]}
        <span>{displayedValue}</span>
      </ExtractionParam>
    )
  })
)

const LLMExtractorsList = ({
  llmExtractors,
  onChange,
}) => {
  const renderLLMType = (extractorName) => (
    <LLMType>
      {extractorName}
    </LLMType>
  )

  const getPanelHeader = useCallback((llmExtractor) => (
    <HeaderWrapper
      onClick={() => onChange?.(llmExtractor.extractorId)}
    >
      <ExtractionName>
        {llmExtractor.name}
      </ExtractionName>
      <ExtractorLLMType
        llmReference={llmExtractor.llmReference}
        render={renderLLMType}
      />
    </HeaderWrapper>
  ), [onChange])

  const getExtractionParams = useCallback((extractionParams) => {
    return (
      <ExtractionParamsWrapper>
        {renderExtractionParams(extractionParams)}
      </ExtractionParamsWrapper>
    )
  }, [])

  const renderExpandButton = useCallback((panelProps, onClick) => (
    <StyledIconButton
      icon={
        (
          <DownOutlined
            rotate={panelProps.isActive ? 180 : 0}
          />
        )
      }
      onClick={onClick}
    />
  ), [])

  const renderPanels = useCallback(() => llmExtractors.map((extractor) => (
    <Panel
      key={extractor.extractorId}
      header={getPanelHeader(extractor)}
    >
      <div
        onClick={() => onChange?.(extractor.extractorId)}
      >
        {getExtractionParams(extractor.extractionParams)}
        <Instruction>
          {extractor.extractionParams.customInstruction}
        </Instruction>
      </div>
    </Panel>
  )), [
    getExtractionParams,
    getPanelHeader,
    llmExtractors,
    onChange,
  ])

  return (
    <Collapse
      renderExpandButton={renderExpandButton}
      renderPanels={renderPanels}
    />
  )
}

LLMExtractorsList.propTypes = {
  llmExtractors: PropTypes.arrayOf(llmExtractorShape).isRequired,
  onChange: PropTypes.func,
}

export {
  LLMExtractorsList,
}
