
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { RequestMethod } from '@/enums/RequestMethod'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { PrototypeFieldMapping } from '@/models/PrototypeField'
import {
  PrototypeTableHeader,
  PrototypeTabularMapping,
  TableHeaderType,
} from '@/models/PrototypeTableField'
import { apiMap } from '@/utils/apiMap'
import {
  useFetchPrototypeQuery,
  useCreatePrototypeMutation,
  useUpdatePrototypeMutation,
  useCreatePrototypeFieldMappingMutation,
  useUpdatePrototypeFieldMappingMutation,
  useCreatePrototypeTabularMappingMutation,
  useUpdatePrototypeTabularMappingMutation,
} from './prototypesApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useFetchPrototypeQuery: jest.fn((args) => res.fetchPrototype(args)),
        useCreatePrototypeMutation: jest.fn((args) => res.createPrototype(args)),
        useUpdatePrototypeMutation: jest.fn((args) => res.updatePrototype(args)),
        useCreatePrototypeFieldMappingMutation: jest.fn((args) => res.createPrototypeFieldMapping(args)),
        useUpdatePrototypeFieldMappingMutation: jest.fn((args) => res.updatePrototypeFieldMapping(args)),
        useCreatePrototypeTabularMappingMutation: jest.fn((args) => res.createPrototypeTabularMapping(args)),
        useUpdatePrototypeTabularMappingMutation: jest.fn((args) => res.updatePrototypeTabularMapping(args)),
      }
    },
  },
}))

const prototypeId = 'mockPrototypeId'
const fieldCode = 'mockFieldCode'

const mockExtractionField = new DocumentTypeField(
  fieldCode,
  'Field name',
  {},
  FieldType.STRING,
)

const mockExtractionTableField = new DocumentTypeField(
  fieldCode,
  'Table field name',
  {},
  FieldType.TABLE,
)

const mockField = {
  ...mockExtractionField,
  mapping: new PrototypeFieldMapping({
    keys: ['Key1'],
    mappingDataType: FieldType.STRING,
    mappingType: MappingType.ONE_TO_ONE,
  }),
}

const mockTableFieldData = {
  code: mockExtractionTableField.code,
  ...new PrototypeTabularMapping({
    headerType: TableHeaderType.ROWS,
    headers: [
      new PrototypeTableHeader({
        name: 'Row name',
        aliases: ['Row alias'],
      }),
    ],
    occurrenceIndex: 0,
  }),
}

describe('prototypesApi: useFetchPrototypeQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const { result } = renderHook(() => useFetchPrototypeQuery(prototypeId))

    await waitFor(() => {
      expect(result.current).toEqual(
        apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype(prototypeId),
      )
    })
  })
})

describe('prototypesApi: useCreatePrototypeMutation', () => {
  test('calls correct endpoint', async () => {
    const data = 'mockPrototypeData'

    const { result } = renderHook(() => useCreatePrototypeMutation(data))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.prototype(),
        method: RequestMethod.POST,
        body: data,
      })
    })
  })
})

describe('prototypesApi: useUpdatePrototypeMutation', () => {
  test('calls correct endpoint', async () => {
    const data = 'mockPrototypeData'

    const { result } = renderHook(() => useUpdatePrototypeMutation({
      prototypeId,
      data,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype(prototypeId),
        method: RequestMethod.PATCH,
        body: {
          data,
        },
      })
    })
  })
})

describe('prototypesApi: useCreatePrototypeFieldMappingMutation', () => {
  test('calls correct endpoint', async () => {
    const { result } = renderHook(() => useCreatePrototypeFieldMappingMutation({
      prototypeId,
      field: mockField,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.mappings(prototypeId),
        method: RequestMethod.POST,
        body: {
          code: mockField.code,
          typeCode: mockField.fieldType,
          keys: mockField.mapping.keys,
          mappingType: mockField.mapping.mappingType,
        },
      })
    })
  })
})

describe('prototypesApi: useUpdatePrototypeFieldMappingMutation', () => {
  test('calls correct endpoint', async () => {
    const mockKeys = ['Key1', 'Key2']

    const { result } = renderHook(() => useUpdatePrototypeFieldMappingMutation({
      prototypeId,
      fieldCode: mockField.code,
      keys: mockKeys,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.mappings.field(prototypeId, mockField.code),
        method: RequestMethod.PUT,
        body: {
          keys: mockKeys,
        },
      })
    })
  })
})

describe('prototypesApi: useCreatePrototypeTabularMappingMutation', () => {
  test('calls correct endpoint', async () => {
    const { result } = renderHook(() => useCreatePrototypeTabularMappingMutation({
      prototypeId,
      data: mockTableFieldData,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.tabularMappings(prototypeId),
        method: RequestMethod.POST,
        body: mockTableFieldData,
      })
    })
  })
})

describe('prototypesApi: useUpdatePrototypeTabularMappingMutation', () => {
  test('calls correct endpoint', async () => {
    const mockTabularMapping = new PrototypeTabularMapping({
      headerType: TableHeaderType.ROWS,
      headers: [
        new PrototypeTableHeader({
          name: 'Row name',
          aliases: ['Row alias'],
        }),
      ],
      occurrenceIndex: 0,
    })

    const mockFieldCode = 'mockCode'

    const { result } = renderHook(() => useUpdatePrototypeTabularMappingMutation({
      prototypeId,
      fieldCode: mockFieldCode,
      tabularMapping: mockTabularMapping,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.prototype.tabularMappings.field(prototypeId, mockFieldCode),
        method: RequestMethod.PATCH,
        body: mockTabularMapping,
      })
    })
  })
})
