
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/Button'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { LLMExtractorsList } from '../LLMExtractorsList'
import { SetLLMExtractorButton } from '../SetLLMExtractorButton'
import {
  ChangeButton,
  ExtractorWrapper,
  RotateIcon,
  SectionHeader,
  SectionTitle,
} from './LLMExtractorSection.styles'

const LLMExtractorSection = ({
  value: currentExtractorId,
  onChange,
}) => {
  const emptyContainerRef = useRef(null)
  const extractorContainerRef = useRef(null)
  const documentType = useSelector(documentTypeStateSelector)
  const { llmExtractors } = documentType

  const currentLLMExtractor = llmExtractors.find((extractor) => extractor.extractorId === currentExtractorId)

  const renderSetLLMExtraction = (onClick) => (
    <Button.Secondary
      onClick={onClick}
    >
      {localize(Localization.SET_LLM_EXTRACTOR)}
    </Button.Secondary>
  )

  const renderChangeLLMExtraction = (onClick) => (
    <ChangeButton
      icon={<RotateIcon />}
      onClick={onClick}
    >
      {localize(Localization.CHANGE)}
    </ChangeButton>
  )

  if (!currentExtractorId) {
    return (
      <div>
        <SectionHeader
          ref={emptyContainerRef}
        >
          <SectionTitle>
            {localize(Localization.LLM_EXTRACTOR)}
          </SectionTitle>
        </SectionHeader>
        <ExtractorWrapper>
          {localize(Localization.LLM_EXTRACTOR_WAS_NOT_ADDED)}
          <SetLLMExtractorButton
            containerRef={emptyContainerRef}
            documentType={documentType}
            onChange={onChange}
            renderTrigger={renderSetLLMExtraction}
          />
        </ExtractorWrapper>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader
        ref={extractorContainerRef}
      >
        <SectionTitle>
          {localize(Localization.LLM_EXTRACTOR)}
        </SectionTitle>
        <SetLLMExtractorButton
          containerRef={extractorContainerRef}
          documentType={documentType}
          onChange={onChange}
          renderTrigger={renderChangeLLMExtraction}
        />
      </SectionHeader>
      <LLMExtractorsList
        llmExtractors={[currentLLMExtractor]}
      />
    </div>
  )
}

LLMExtractorSection.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export {
  LLMExtractorSection,
}
