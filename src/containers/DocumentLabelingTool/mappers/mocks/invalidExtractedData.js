
import {
  ExtractedDataField,
} from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'

const mockInvalidExtractedData = [
  new ExtractedDataField(
    720,
    {
      value: 'NEWDOC',
      coordinates: new FieldCoordinates(1, 0.45545454533, 0.53453453453, 0.234234234234, 0.756756756756),
    },
  ),
  new ExtractedDataField(
    731,
    {
      value: 'listTables',
      coordinates: new FieldCoordinates(1, 0.45545454533, 0.53453453453, 0.234234234234, 0.756756756756),
    },
  ),
  new ExtractedDataField(
    729,
    {
      value: 'table',
      coordinates: new FieldCoordinates(1, 0.45545454533, 0.53453453453, 0.234234234234, 0.756756756756),
    },
  ),
  new ExtractedDataField(
    727,
    {
      value: 'kv',
      coordinates: new FieldCoordinates(1, 0.45545454533, 0.53453453453, 0.234234234234, 0.756756756756),
    },
  ),
]

export { mockInvalidExtractedData }
