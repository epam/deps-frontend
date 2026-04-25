
/*
 * The code in this file was directly converted from Python to JavaScript without refactoring.
 * It's a bit of a black box.
*/

import cloneDeep from 'lodash/cloneDeep'
import {
  BlockType,
  sortBlocksByX,
  sortBlocksByY,
  TextBlock,
  TextLine,
} from './baseOCREntities'
import { Bbox, inter } from './Bbox'

const joinTextLineBlocks = (block1, block2, idToBlock) => {
  const [x, nx] = [block1.coordinates.x, block2.coordinates.x]

  block1.coordinates = Bbox.fromUnion([block1.coordinates, block2.coordinates])
  const ids = block1.childBlockIds
  const nIds = block2.childBlockIds

  if (x <= nx) {
    block1.childBlockIds = ids.concat(nIds)
    block1.text = block1.text + ' ' + block2.text
  } else {
    block1.childBlockIds = nIds.concat(ids)
    block1.text = block2.text + ' ' + block1.text
  }

  nIds.forEach((wId) => {
    idToBlock[wId].parent = block1
  })

  delete idToBlock[block2.id]

  return block1
}

const joinTextLines = (lineBlocks, idToBlock, yIouThresh = 0.5) => {
  if (!lineBlocks.length) {
    return lineBlocks
  }

  const newLineBlocks = []
  let currBlock = lineBlocks[0]
  let idx = 1

  while (idx < lineBlocks.length) {
    const nextBlock = lineBlocks[idx]
    const boxesYIou = currBlock.coordinates.yIou(nextBlock.coordinates)

    if (boxesYIou >= yIouThresh) {
      currBlock = joinTextLineBlocks(currBlock, nextBlock, idToBlock)
    } else {
      newLineBlocks.push(currBlock)
      currBlock = nextBlock
    }

    idx += 1
  }

  newLineBlocks.push(currBlock)

  return newLineBlocks
}

const median = (arr) => {
  arr.sort((a, b) => a - b)

  const midIdx = Math.floor(arr.length / 2)

  if (arr.length % 2 === 0) {
    return (arr[midIdx - 1] + arr[midIdx]) / 2
  }

  return arr[midIdx]
}

class OCRGrid {
  #OCR_CONF_THRESHOLD = 0.25

  #ocrToBlocksIdToBlock (pageOcr) {
    const blocks = pageOcr.flatMap((line) => TextBlock.fromTextline(line))
    const idToBlock = Object.fromEntries(blocks.map((block) => [block.id, block]))

    return [blocks, idToBlock]
  }

  #filterLowConfWords (pageOcr) {
    const newLines = []

    pageOcr.forEach((line) => {
      const lineWords = line.wordBoxes.filter(
        (x) => x.confidence >= this.#OCR_CONF_THRESHOLD,
      )

      if (lineWords.length === 0) {
        return
      }

      line.wordBoxes = lineWords
      newLines.push(line)
    })

    return newLines
  }

  constructor (pageOcr, filterLowConfWords = true) {
    if (filterLowConfWords) {
      pageOcr = this.#filterLowConfWords(pageOcr)
    }

    const [blocks, idToBlock] = this.#ocrToBlocksIdToBlock(pageOcr)

    this.idToBlock = idToBlock
    this.lineBlocks = blocks.filter((i) => i.type === BlockType.LINE)
    this.lineBlocks.forEach((line) => {
      line.childBlockIds.forEach((wordId) => {
        if (!(wordId in idToBlock)) {
          throw new Error(`Word ID ${wordId} not in ID dictionary`)
        }
        idToBlock[wordId].parent = line
      })
    })

    this.grid = []
  }

  initGrid () {
    if (!this.lineBlocks || this.lineBlocks.length === 0) {
      delete this.lineBlocks
      return
    }

    const lineBlocks = sortBlocksByY(this.lineBlocks)
    const avgBoxH = median(lineBlocks.map((i) => i.coordinates.h))
    let bigBoxes = lineBlocks.filter((i) => i.coordinates.h > 1.5 * avgBoxH)
    let normalBoxes = lineBlocks.filter((i) => i.coordinates.h <= 1.5 * avgBoxH)

    normalBoxes = joinTextLines(normalBoxes, this.idToBlock)
    normalBoxes = sortBlocksByY(normalBoxes)
    normalBoxes = joinTextLines(normalBoxes, this.idToBlock)
    normalBoxes = sortBlocksByY(normalBoxes)

    bigBoxes = joinTextLines(bigBoxes, this.idToBlock)
    bigBoxes = sortBlocksByY(bigBoxes)

    this.grid = normalBoxes.map(TextLine.fromTextLineBlock)
    let idx = 0

    while (idx < this.grid.length - 1) {
      if (this.grid[idx].yMin <= this.grid[idx + 1].yMin && this.grid[idx].yMax >= this.grid[idx + 1].yMax) {
        this.grid[idx].textlines = [...this.grid[idx].textlines, ...this.grid[idx + 1].textlines]
        this.grid[idx].xMin = Math.min(this.grid[idx].xMin, this.grid[idx + 1].xMin)
        this.grid[idx].xMax = Math.min(this.grid[idx].xMax, this.grid[idx + 1].xMax)
        this.grid = [...this.grid.slice(0, idx + 1), ...this.grid.slice(idx + 2)]
      } else {
        idx++
      }
    }

    bigBoxes.forEach((lineBlock) => {
      this.#addIntersectingBlock(lineBlock)
    })

    this.#buildXGrid()

    delete this.lineBlocks
  }

  static spanSearchWithEmpty (array, cMin, cMax, cMinFunc, cMaxFunc) {
    if (!array || array.length === 0) {
      return [0, 0]
    }

    let idxStart = 0
    let idxEnd = array.length - 1
    let idx = Math.floor((idxStart + idxEnd) / 2)

    while (
      !(cMinFunc(array[idx]) <= cMin && cMin <= cMaxFunc(array[idx])) &&
      !(idx > 0 && cMaxFunc(array[idx - 1]) < cMin && cMin < cMinFunc(array[idx]))
    ) {
      if (cMin < cMinFunc(array[idx])) {
        if (idx === idxStart) {
          break
        } else {
          idxEnd = idx - 1
          idx = Math.floor((idxStart + idxEnd) / 2)
        }
      } else {
        if (idx === idxEnd) {
          return [array.length - 1, array.length - 1]
        }

        if (idx + 1 === idxEnd) {
          idxStart = idx
          idx = idxEnd
        } else {
          idxStart = idx + 1
          idx = Math.floor((idxStart + idxEnd) / 2)
        }
      }
    }

    if (idx > 0 && cMinFunc(array[idx - 1]) <= cMin && cMin <= cMaxFunc(array[idx - 1])) {
      idx -= 1
    }

    const foundStart = idx

    idxStart = foundStart
    idxEnd = array.length - 1
    idx = Math.floor((idxStart + idxEnd) / 2)

    while (!(cMinFunc(array[idx]) <= cMax && cMax <= cMaxFunc(array[idx]))) {
      if (cMax < cMinFunc(array[idx])) {
        if (idx === idxStart) {
          if (idx === 0) {
            return [0, 0]
          }
          break
        } else {
          idxEnd = idx - 1
          idx = Math.floor((idxStart + idxEnd) / 2)
        }
      } else {
        if (idx === idxEnd) {
          break
        }

        if (idx + 1 === idxEnd) {
          idxStart = idx
          idx = idxEnd
        } else {
          idxStart = idx + 1
          idx = Math.floor((idxStart + idxEnd) / 2)
        }
      }
    }

    if (
      idx + 1 < array.length &&
      cMinFunc(array[idx + 1]) <= cMax &&
      cMax <= cMaxFunc(array[idx + 1])
    ) {
      idx += 1
    }
    const foundEnd = idx

    return [foundStart, foundEnd]
  }

  spanSearch (array, cMin, cMax, cMinFunc, cMaxFunc) {
    if (!array || array.length === 0) {
      return []
    }

    const [foundStart, foundEnd] = OCRGrid.spanSearchWithEmpty(array, cMin, cMax, cMinFunc, cMaxFunc)

    if (
      foundStart === foundEnd &&
      (
        (cMin <= cMax && cMax < cMinFunc(array[foundStart])) ||
        cMaxFunc(array[foundEnd]) < cMin
      )
    ) {
      return []
    }

    return [foundStart, foundEnd]
  }

  #findLinesRange (yMin, yMax) {
    return this.spanSearch(
      this.grid,
      yMin,
      yMax,
      (x) => x.yMin,
      (x) => x.yMax,
    )
  }

  #deriveBlockForYRange (yMin, yMax, lineBlock) {
    const words = lineBlock.childBlockIds.map((wordId) => this.idToBlock[wordId])

    const currWords = words.filter((wordBlock) => {
      const [wY, wYMax] = [wordBlock.coordinates.y, wordBlock.coordinates.yMax]

      if (wYMax < yMin || wY >= yMax) {
        return
      }

      return inter(yMin, yMax, wY, wYMax) > 0
    })

    if (!currWords.length) {
      return null
    }

    if (currWords.length === lineBlock.childBlockIds.length) {
      return lineBlock
    }

    const currLineBlock = cloneDeep(lineBlock)
    currLineBlock.childBlockIds = currWords.map((w) => w.id)
    currLineBlock.text = currWords.map((w) => w.text).join(' ')
    currLineBlock.coordinates = Bbox.fromUnion(currWords.map((w) => w.coordinates))

    return currLineBlock
  }

  #deriveTextLineForYRange (yMin, yMax, lineBlock) {
    const currLineBlock = this.#deriveBlockForYRange(yMin, yMax, lineBlock)

    if (!currLineBlock) {
      return null
    }

    const newTextLine = TextLine.fromTextLineBlock(currLineBlock)
    newTextLine.yMin = yMin
    newTextLine.yMax = yMax

    return newTextLine
  }

  #addIntersectingBlock (lineBlock) {
    const [y, h] = [lineBlock.coordinates.y, lineBlock.coordinates.h]
    const cMinFunc = (x) => x.yMin
    const cMaxFunc = (x) => x.yMax

    const [start, end] = OCRGrid.spanSearchWithEmpty(
      this.grid,
      y,
      y + h,
      cMinFunc,
      cMaxFunc,
    )

    if (start === end && cMaxFunc(this.grid[end]) < y) {
      // line_block should be the last line in grid
      this.grid.push(TextLine.fromTextLineBlock(lineBlock))
    } else if (start === end && y + h < cMinFunc(this.grid[start])) {
      // line_block does not intersect with any lines and should be inserted at index
      const newTextLine = TextLine.fromTextLineBlock(lineBlock)
      this.grid.splice(start, 0, newTextLine)
    } else {
      // line_block intersects with one or more lines, should be added to these lines,
      // and as intermediate lines between them

      const updatedBlocks = []
      let yMin = y

      for (let idx = start; idx <= end; idx++) {
        if (yMin < cMinFunc(this.grid[idx])) {
          const yMax = cMinFunc(this.grid[idx])
          const newTextLine = this.#deriveTextLineForYRange(yMin, yMax, lineBlock)

          if (newTextLine) {
            updatedBlocks.push(newTextLine)
          }
        }

        yMin = cMinFunc(this.grid[idx])
        const yMax = cMaxFunc(this.grid[idx])
        const currLineBlock = this.#deriveBlockForYRange(yMin, yMax, lineBlock)

        if (currLineBlock) {
          this.grid[idx].textlines.push(currLineBlock)
        }

        updatedBlocks.push(this.grid[idx])
        yMin = yMax
      }

      if (cMaxFunc(this.grid[end]) < y + h) {
        yMin = cMaxFunc(this.grid[end])
        const yMax = y + h
        const newTextLine = this.#deriveTextLineForYRange(yMin, yMax, lineBlock)

        if (newTextLine) {
          updatedBlocks.push(newTextLine)
        }
      }

      this.grid = [
        ...this.grid.slice(0, start),
        ...updatedBlocks,
        ...this.grid.slice(end + 1),
      ]
    }
  }

  #buildXGrid () {
    this.grid.forEach((line) => {
      line.xMin = Math.min(...line.textlines.map((textline) => textline.coordinates.x))
      line.xMax = Math.max(...line.textlines.map((textline) => textline.coordinates.xMax))

      line.textlines.forEach((textline) => {
        const words = textline.childBlockIds.map((id) => this.idToBlock[id])
        textline.words = sortBlocksByX(words)
      })
    })

    Object.values(this.idToBlock).forEach((block) => {
      if (block.type === BlockType.LINE) {
        if (!block.words && block.childBlockIds.length > 0) {
          throw new Error(`Words for line ${JSON.stringify(block)} should have been assigned.`)
        }
      }
    })
  }

  findRectangle (yMin, yMax, xMin, xMax, threshold = 0.5) {
    const getRectArea = (x1, y1, x2, y2) => (x2 - x1) * (y2 - y1)

    const getIntersectionArea = (word) => {
      const left = Math.max(word.coordinates.x, xMin)
      const right = Math.min(word.coordinates.xMax, xMax)
      const bottom = Math.max(word.coordinates.y, yMin)
      const top = Math.min(word.coordinates.yMax, yMax)

      if (!((right > left) && (top > bottom))) {
        return 0
      }

      return getRectArea(left, bottom, right, top)
    }

    const isWordPartInsideReact = (word) => {
      const { x, y, xMax, yMax } = word.coordinates ?? {}
      const area = getIntersectionArea(word)
      const result = area / getRectArea(x, y, xMax, yMax)

      return result > threshold
    }

    const yIndices = this.#findLinesRange(yMin, yMax)

    if (!yIndices || yIndices.length === 0) {
      return []
    }

    const resultTextLines = []
    const [yStart, yEnd] = yIndices
    const seenWordIds = new Set()

    this.grid.slice(yStart, yEnd + 1).forEach(({ textlines }) => {
      textlines.forEach((textline) => {
        const indices = this.spanSearch(
          textline.words,
          xMin,
          xMax,
          (x) => x.coordinates.x,
          (x) => x.coordinates.xMax,
        )

        if (!indices || indices.length === 0) {
          return
        }

        let words = textline.words.slice(indices[0], indices[1] + 1)
        words = words.filter((word) => !seenWordIds.has(word.id))

        if (!words.length) {
          return
        }

        words = words.filter(isWordPartInsideReact)

        if (!words.length) {
          return
        }

        resultTextLines.push(words)
        words.forEach((word) => seenWordIds.add(word.id))
      })
    })

    return resultTextLines
  }
}

export { OCRGrid }
