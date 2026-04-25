
import { mockEnv } from '@/mocks/mockEnv'
import { getPage2Text } from '../OCRGrid/tests/conftest'
import { getRectContent } from './getRectContent'

jest.mock('@/utils/env', () => mockEnv)

const page2text = getPage2Text()

describe('OCRTextExtractor: getRectContent', () => {
  it('should return correct content when call getRectContent', () => {
    const textLines = page2text['1']
    const { content, bbox, confidence } = textLines[0].wordBoxes[0]

    const coords = {
      yMin: bbox.y,
      xMin: bbox.x,
      xMax: bbox.x + bbox.w,
      yMax: bbox.y + bbox.h,
    }
    const rectContent = getRectContent(textLines, coords)

    expect(rectContent).toEqual({
      content,
      confidence,
    })
  })
})
