
import { mockSelector } from '@/mocks/mockSelector'
import { Engine } from '@/models/Engine'

const ocrEnginesSelector = mockSelector([
  new Engine('TESSERACT', 'Tesseract'),
  new Engine('GCP_VISION', 'AI Vision'),
  new Engine('AWS_TEXTRACT', 'AWS Textract'),
])

const tableEnginesSelector = mockSelector([
  new Engine('TESSERACT', 'Tesseract'),
  new Engine('GCP_VISION', 'AI Vision'),
  new Engine('AWS_TEXTRACT', 'AWS Textract'),
])

export {
  ocrEnginesSelector,
  tableEnginesSelector,
}
