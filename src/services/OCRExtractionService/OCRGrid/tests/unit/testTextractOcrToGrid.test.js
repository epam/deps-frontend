
import { mockEnv } from '@/mocks/mockEnv'
import { OCRGrid } from '../../OCRGrid'
import { getPage2Text, getPage2Labels } from '../conftest'

jest.mock('@/utils/env', () => mockEnv)

const page2text = getPage2Text()
const page2labels = getPage2Labels()

describe('OCRGrid', () => {
  it('should correctly match label words and text words in the grid', () => {
    Object.entries(page2text).forEach(([page, text]) => {
      if (!page2labels[page]) {
        return
      }

      const currLabels = page2labels[page]
      const grid = new OCRGrid(text)
      grid.initGrid()

      Object.values(currLabels).forEach((labelValues) => {
        labelValues.forEach((value) => {
          const labelText = value.content
          const bbox = value.bbox
          const { x, y, w, h } = bbox
          const rect = grid.findRectangle(y, y + h, x, x + w, 0.5)
          const labelWords = labelText
            .split('\n')
            .reduce((acc, line) => {
              if (line) {
                acc.push(line.split(' '))
              }

              return acc
            }, [])

          const textWords = rect.map((line) => line.map(({ text }) => text))

          expect(labelWords.flat()).toEqual(textWords.flat())
        })
      })
    })
  })
})
