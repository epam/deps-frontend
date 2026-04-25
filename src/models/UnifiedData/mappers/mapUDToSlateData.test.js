
import { SLATE_ELEMENT_TYPE } from '@/containers/Slate/models'
import { UnifiedDataPositionalText, UnifiedDataWord } from '@/models/UnifiedData'
import { mapUDToSlateData } from './mapUDToSlateData'

describe('mapper: mapUDToSlateData', () => {
  let ud, expectedSlateData

  it('should map unified data into slate data with paragraphs', () => {
    const udDataWord = new UnifiedDataWord({
      content: 'word',
      confidence: 1,
    })

    ud = [
      new UnifiedDataPositionalText('id', 1, [udDataWord]),
    ]

    expectedSlateData = {
      id: 'id',
      type: SLATE_ELEMENT_TYPE.PARAGRAPH,
      children: [{
        text: udDataWord.word.content,
        charRange: {
          begin: 0,
          end: 3,
        },
      }],
    }
    expect(mapUDToSlateData(ud)).toEqual([expectedSlateData])
  })

  it('should map unified data into slate data with tables', () => {
    const udCell = {
      coordinates: {
        colspan: 0,
        rowspan: 0,
        row: 0,
        column: 0,
      },
      value: {
        content: 'mock content',
        confidence: 1,
      },
    }

    ud = [
      {
        cells: [udCell],
        coordinates: null,
        id: 'mockId',
        page: 1,
        maxRow: 1,
      },
    ]

    expectedSlateData = {
      id: 'mockId',
      type: SLATE_ELEMENT_TYPE.TABLE,
      children: [
        {
          children: [
            {
              attributes: {
                colSpan: 0,
                rowSpan: 0,
              },
              children: [
                {
                  text: 'mock content',
                },
              ],
              coordinates: {
                column: 0,
                row: 0,
              },
              tableId: 'mockId',
              type: 'table-cell',
            },
          ],
          type: 'table-row',
        },
      ],
    }

    expect(mapUDToSlateData(ud)).toEqual([expectedSlateData])
  })
})
