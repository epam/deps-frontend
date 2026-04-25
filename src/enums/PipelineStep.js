import { localize, Localization } from '@/localization/i18n'

const PipelineStep = {
  EXTRACTION: 'extraction',
  PARSING: 'parsing',
}

const RESOURCE_PIPELINE_STEP = {
  [PipelineStep.EXTRACTION]: localize(Localization.DATA_EXTRACTION),
  [PipelineStep.PARSING]: localize(Localization.PARSING),
}

export {
  PipelineStep,
  RESOURCE_PIPELINE_STEP,
}
