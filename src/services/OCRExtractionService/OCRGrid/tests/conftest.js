
import { TextBlock, TextLine } from '../baseOCREntities'
import { BboxModel, TextLineModel, WordBoxModel } from '../OCRModel'
import jsonBlocksBig from './data/big_blocks.json'
import jsonBlocksInitial from './data/initial_blocks.json'
import labels from './data/labels_data.json'
import jsonBlocksNormal from './data/normal_blocks.json'
import pagesTextData from './data/readable_text_data.json'

export function getPage2Labels () {
  const pageIds = new Set()
  const page2labels = {}

  const transformedLabels = labels.map((label) => {
    const transformedData = label.data.map(({ value, coordinates }) => {
      return new WordBoxModel(value, new BboxModel(coordinates))
    })

    return {
      ...label,
      data: transformedData,
    }
  })

  transformedLabels.forEach((label) => {
    label.data.forEach(({ bbox }) => {
      pageIds.add(bbox.page)
    })
  })

  const pageIdsArray = Array.from(pageIds).sort()

  pageIdsArray.forEach((page) => {
    page2labels[page] = {}
    transformedLabels.forEach((label) => {
      page2labels[page][label.fieldName] = []
    })
  })

  transformedLabels.forEach((label) => {
    label.data.forEach((value) => {
      const { page } = value.bbox
      page2labels[page][label.fieldName].push(value)
    })
  })

  return page2labels
}

export function getPage2Text () {
  return pagesTextData.reduce((acc, page) => {
    acc[page.page] = page.textLines.map((line) => {
      return new TextLineModel(line)
    })
    return acc
  }, {})
}

export function getInitialBoxes () {
  return jsonBlocksInitial.map((item) => new TextBlock(item))
}

export function getNormalBoxes () {
  return jsonBlocksNormal.map((item) => new TextLine(item))
}

export function getBigBoxes () {
  return jsonBlocksBig.slice(0, -2).map((item) => new TextBlock(item))
}

export function getInterBigBox () {
  return new TextBlock(jsonBlocksBig[jsonBlocksBig.length - 2])
}

export function getTwoInterBigBox () {
  return new TextBlock(jsonBlocksBig[jsonBlocksBig.length - 1])
}
