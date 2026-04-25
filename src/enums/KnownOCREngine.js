
import { localize, Localization } from '@/localization/i18n'

const KnownOCREngine = {
  AZURE_FORM_RECOGNIZER: 'AZURE_FORM_RECOGNIZER',
  GCP_VISION: 'GCP_VISION',
  AWS_TEXTRACT: 'AWS_TEXTRACT',
  TESSERACT: 'TESSERACT',
}

const RESOURCE_OCR_ENGINE = {
  [KnownOCREngine.TESSERACT]: localize(Localization.TESSERACT),
  [KnownOCREngine.GCP_VISION]: localize(Localization.GCP_DOCUMENT_AI),
  [KnownOCREngine.AWS_TEXTRACT]: localize(Localization.AWS_TEXTRACT),
  [KnownOCREngine.AZURE_FORM_RECOGNIZER]: localize(Localization.AZURE_DOCUMENT_INTELLIGENCE),
}

export {
  KnownOCREngine,
  RESOURCE_OCR_ENGINE,
}
