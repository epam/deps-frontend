
import cloneDeep from 'lodash/cloneDeep'
import { ExtractedDataField } from './ExtractedDataField'

class ExtractedData {
  static getFieldsByPks = (extractedData, pks) => extractedData.filter((f) => pks.includes(f.fieldPk))

  static getPages = (extractedData, document) => {
    const pages = extractedData.flatMap((f) => (
      ExtractedDataField.getPages(f.data, document)
    ))

    return [...new Set([...pages])]
  }

  static getFieldsByPage = (extractedData, pageNumber, document) => {
    return extractedData.reduce((acc, field) => {
      if (Array.isArray(field.data)) {
        const fieldData = field.data.filter((d) => {
          const pages = ExtractedDataField.getPages(d, document)

          return (
            (!pages?.[0] && !pageNumber) ||
            pages?.includes(pageNumber)
          )
        })

        return fieldData.length
          ? [
            ...acc,
            {
              ...field,
              data: fieldData,
            },
          ]
          : acc
      }

      const pages = ExtractedDataField.getPages(field.data, document)

      return (!pages?.[0] && !pageNumber) || pages?.includes(pageNumber)
        ? [...acc, field]
        : acc
    }, [])
  }

  static getUpdates = (extractedData, dtField) => {
    const extractedDataClone = extractedData ? cloneDeep(extractedData) : []
    const fieldToUpdate = ExtractedData.getFieldByPk(extractedDataClone, dtField.pk)

    if (fieldToUpdate) {
      return {
        extractedDataClone,
        fieldToUpdate,
      }
    }

    const newEdField = new ExtractedDataField(
      dtField.pk,
      ExtractedDataField.getEmptyData(dtField),
    )

    return {
      extractedDataClone: [...extractedDataClone, newEdField],
      fieldToUpdate: newEdField,
    }
  }

  static getFieldByPk = (extractedData, pk) => {
    return extractedData?.find((f) => f.fieldPk === pk)
  }

  static replaceField = (extractedData, fieldToRemove, fieldToPaste) => extractedData.map((f) => (f === fieldToRemove) ? fieldToPaste : f)

  static deleteField = (extractedData, fieldToDelete) => extractedData.filter((field) => field !== fieldToDelete)

  static isModified = (ed) => {
    const isKVFieldModified = (data) => {
      const { key, value } = data
      return !!(key?.modifiedBy || value?.modifiedBy)
    }

    const isFieldModified = (data) => {
      if (data.key && data.value) {
        return isKVFieldModified(data)
      }
      return data.modifiedBy
    }

    return ed.some(({ data }) => {
      if (Array.isArray(data)) {
        return data.some((field) => {
          return isFieldModified(field)
        })
      }
      return isFieldModified(data)
    })
  }

  static getFieldsBySetIndex = (ed, setIndex) => (
    ed.reduce((acc, curr) => {
      const fieldData = ExtractedDataField.getFieldDataBySetIndex(curr, setIndex)

      if (fieldData) {
        acc.push(fieldData)
      }

      return acc
    }, [])
  )

  static getSetIndexes = (ed) => {
    const setIndexes = ed.flatMap((edField) => ExtractedDataField.getSetIndexes(edField.data))

    return [...new Set(setIndexes)]
  }
}

export {
  ExtractedData,
}
