
import cloneDeep from 'lodash/cloneDeep'
import { v4 } from 'uuid'
import { Bbox } from './Bbox'
import { valueIsInRange } from './OCRUtils'

export class BlockType {
  static LINE = 'LINE'
  static WORD = 'WORD'

  static fromString (name) {
    if (BlockType.LINE === name) {
      return BlockType.LINE
    } else if (BlockType.WORD === name) {
      return BlockType.WORD
    }

    throw new Error(`Name '${name}' is not in the list of acceptable names.`)
  }
}

export class TextBlock {
  constructor ({
    id,
    type,
    coordinates,
    text = '',
    confidence = 0,
    childBlockIds = [],
    parent = null,
    words = [],
  }) {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence shold be between 0 and 1')
    }

    this.id = id
    this.type = type
    this.coordinates = coordinates
    this.text = text
    this.confidence = confidence
    this.childBlockIds = childBlockIds
    this.parent = parent
    this.words = words
  }

  static fromTextline (textline) {
    const wordBlocks = textline.wordBoxes.map(
      ({ content, bbox, confidence }) => (
        new TextBlock({
          id: v4(),
          type: BlockType.WORD,
          coordinates: new Bbox(bbox),
          text: content,
          confidence: confidence,
          childBlockIds: [],
        })
      ),
    )

    const lineBlock = new TextBlock({
      id: v4(),
      type: BlockType.LINE,
      coordinates: Bbox.fromUnion(
        wordBlocks.map(({ coordinates }) => coordinates),
      ),
      text: wordBlocks.map(({ text }) => text).join(' '),
      confidence: Math.min(...wordBlocks.map(({ confidence }) => confidence)),
      childBlockIds: wordBlocks.map(({ id }) => id),
    })

    return [lineBlock, ...wordBlocks]
  }

  copy () {
    const block = new TextBlock(...this.dict())
    block.coordinates = cloneDeep(this.coordinates)
    block.parent = this.parent
    block.words = this.words
    return block
  }

  dict (exclude = new Set()) {
    const defaultExcludes = new Set(['parent', 'words'])
    const mergedExcludes = new Set([...exclude, ...defaultExcludes])

    return Object.fromEntries(
      Object.entries(this).filter(([key]) => !mergedExcludes.has(key)),
    )
  }
}

export class TextLine {
  constructor ({ yMin, yMax, xMin, xMax, textlines }) {
    this.yMin = yMin
    this.yMax = yMax
    this.xMin = xMin
    this.xMax = xMax
    this.textlines = textlines

    this.#validateInitParameters({
      yMin,
      yMax,
      xMin,
      xMax,
    })
  }

  static fromTextLineBlock (lineBlock) {
    const [y, x, h, w] = lineBlock.coordinates.toYXHW()
    return new TextLine({
      yMin: y,
      yMax: y + h,
      xMin: x,
      xMax: x + w,
      textlines: [lineBlock],
    })
  }

  #validateInitParameters ({ yMin, yMax, xMin, xMax }) {
    if ([yMin, yMax, xMin, xMax].every((value) => valueIsInRange(value, 0, 1))) {
      throw new Error('Value should be between 0 and 1')
    }
  }
}

export const sortBlocksByY = (blocks) => {
  return blocks.sort((a, b) => a.coordinates.y - b.coordinates.y)
}

export const sortBlocksByX = (blocks) => {
  return blocks.sort((a, b) => a.coordinates.x - b.coordinates.x)
}
