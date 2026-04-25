/* eslint-disable camelcase */

import { valueIsInRange } from './OCRUtils'

export class BboxModel {
  constructor ({ y, x, w, h, page = 1 }) {
    if (y + h > 1 && (y + h).toFixed(6) !== 1) {
      throw new Error(`Sum of y and h is more than 1 (${y + h})`)
    }

    if (x + w > 1 && (x + w).toFixed(6) !== 1) {
      throw new Error(`Sum of x and w is more than 1 (${x + w})`)
    }

    this.#validateInitParameter(x, y, w, h)

    this.y = y
    this.x = x
    this.w = w
    this.h = h
    this.page = page
  }

  #validateInitParameter (y, x, w, h) {
    if ([y, x, w, h].some((value) => value === undefined)) {
      throw Error('y, x, w, and h must be provided')
    }

    if ([y, x, w, h].every((value) => valueIsInRange(value, 0, 1))) {
      throw Error('y, x, w, and h must be between 0 and 1')
    }
  }

  get top () {
    return this.y
  }

  get left () {
    return this.x
  }

  get bottom () {
    return this.y + this.h
  }

  get right () {
    return this.x + this.w
  }

  get centerx () {
    return this.x + this.w / 2
  }

  get centery () {
    return this.y + this.h / 2
  }
}

export class WordBoxModel {
  constructor (content, bbox, confidence = 1) {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence must be between 0 and 1')
    }

    this.content = content
    this.bbox = bbox
    this.confidence = confidence
  }
}

export class TextLineModel {
  constructor ({ id, wordBoxes, word_boxes }) {
    this.id = id
    this.wordBoxes = wordBoxes || word_boxes
  }
}
