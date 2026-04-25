
import { mockEnv } from '@/mocks/mockEnv'
import { Engine } from '@/models/Engine'
import {
  enginesSelector,
  ocrEnginesSelector,
  tableEnginesSelector,
} from './engines'

jest.mock('@/utils/env', () => mockEnv)

describe('Selectors: engines', () => {
  let state

  beforeEach(() => {
    state = {
      engines: {
        ocr: [
          new Engine('TESSERACT', 'Tesseract'),
          new Engine('GCP_VISION', 'AI Vision'),
          new Engine('AWS_TEXTRACT', 'AWS Textract'),
        ],
        table: 'mockTable',
      },
    }
  })

  it('selector: enginesSelector', () => {
    expect(enginesSelector(state)).toBe(state.engines)
  })

  it('selector: ocrEnginesSelector', () => {
    expect(ocrEnginesSelector(state)).toBe(state.engines.ocr)
  })

  it('selector: tableEnginesSelector', () => {
    expect(tableEnginesSelector(state)).toBe(state.engines.table)
  })
})
