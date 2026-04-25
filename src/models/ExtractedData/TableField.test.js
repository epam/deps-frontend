
import { Rect } from '../Rect'
import { TableData } from './TableField'

describe('Model: TableField', () => {
  const testTableField = new TableData('1', [], [], [], new Rect(1, 2, 3, 4))

  it('should return true for a valid TableField structure', () => {
    const result = TableData.isValid(testTableField)
    expect(result).toBe(true)
  })
})
