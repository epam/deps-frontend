
import {
  getQueryString,
  searchParamsToQueryString,
  queryStringToSearchParams,
  queryStringify,
} from '@/utils/queryString'

describe('Utils queryString:', () => {
  describe('queryStringify', () => {
    it('should return correct value', () => {
      const mockSearchParams = {
        hello: 'world',
      }

      const query = queryStringify(mockSearchParams)

      expect(query).toEqual('hello=world')
    })
  })

  describe('searchParamsToQueryString', () => {
    it('should return correct query string', () => {
      const mockSearchParams = {
        filters: {
          stringKey: 'str',
          arrayKey: [2, '3'],
          trueKey: true,
          falseKey: false,
          zeroValue: 0,
          emptyStringKey: '',
          undefinedKey: undefined,
          nullKey: null,
          emptyArrayKey: [],
          emptyObject: {},
          obj: {
            stringKey: 'str',
            undefinedKey: undefined,
            nullKey: null,
            emptyArrayKey: [],
            emptyObject: {},
          },
          objectKey: {
            a: 'asd',
            b: 33,
          },
        },
      }
      // TODO: #2599
      // eslint-disable-next-line
      const expectedString = '?filters=%7B%22stringKey%22%3A%22str%22%2C%22arrayKey%22%3A%5B2%2C%223%22%5D%2C%22trueKey%22%3Atrue%2C%22falseKey%22%3Afalse%2C%22zeroValue%22%3A0%2C%22obj%22%3A%7B%22stringKey%22%3A%22str%22%7D%2C%22objectKey%22%3A%7B%22a%22%3A%22asd%22%2C%22b%22%3A33%7D%7D'

      expect(searchParamsToQueryString(mockSearchParams)).toEqual(expectedString)
    })

    it('should return query question mark in case empty object search', () => {
      const mock = {}
      expect(searchParamsToQueryString(mock)).toEqual('')
    })

    it('should return correct querry string', () => {
      const mockSearchParams = {
        filters: {
          dateRange: ['2021-10-17T21:00:00.000Z', '2021-10-20T20:59:59.999Z'],
          engines: ['TESSERACT'],
          search: '&',
          states: ['inReview'],
          title: '-',
          types: ['type2'],
        },
        selection: ['10'],
      }
      // eslint-disable-next-line
      const expectedQuerry = '?filters=%7B%22dateRange%22%3A%5B%222021-10-17T21%3A00%3A00.000Z%22%2C%222021-10-20T20%3A59%3A59.999Z%22%5D%2C%22engines%22%3A%5B%22TESSERACT%22%5D%2C%22search%22%3A%22%26%22%2C%22states%22%3A%5B%22inReview%22%5D%2C%22title%22%3A%22-%22%2C%22types%22%3A%5B%22type2%22%5D%7D&selection=%5B%2210%22%5D'
      expect(searchParamsToQueryString(mockSearchParams)).toEqual(expectedQuerry)
    })
  })

  describe('getQueryString', () => {
    it('should return correct query string', () => {
      const mockSearchParams = {
        hello: 'world',
        hey: ['how', 'are', 'u'],
      }
      const expectedString = '?hello=world&hey=how&hey=are&hey=u'
      expect(getQueryString(mockSearchParams)).toEqual(expectedString)
    })
  })

  describe('queryStringToSearchParams', () => {
    it('should return correct search params object', () => {
      // eslint-disable-next-line
      const mockInvalidQueryString = '?filters=%7B%22stringKey%22%3A%22str%22%2C%22arrayKey%22%3A%5B2%2C%223%22%5D%2C%22trueKey%22%3Atrue%2C%22falseKey%22%3Afalse%2C%22zeroValue%22%3A0%2C%22obj%22%3A%7B%22stringKey%22%3A%22str%22%7D%2C%22objectKey%22%3A%7B%22a%22%3A%22asd%22%2C%22b%22%3A33%7D%7D'

      const expectedSearchParams = {
        filters: {
          stringKey: 'str',
          arrayKey: [2, '3'],
          trueKey: true,
          falseKey: false,
          zeroValue: 0,
          obj: {
            stringKey: 'str',
          },
          objectKey: {
            a: 'asd',
            b: 33,
          },
        },
      }

      expect(queryStringToSearchParams(mockInvalidQueryString)).toEqual(expectedSearchParams)
    })

    it('should return correct search params object', () => {
      // eslint-disable-next-line
      const mockValudQueryString = '?filters=%7B%22title%22%3A%22-%22%2C%22types%22%3A%5B%22type2%22%5D%2C%22states%22%3A%5B%22inReview%22%5D%2C%22dateRange%22%3A%5B%222021-10-17T21%3A00%3A00.000Z%22%2C%222021-10-20T20%3A59%3A59.999Z%22%5D%2C%22engines%22%3A%5B%22TESSERACT%22%5D%2C%22search%22%3A%22%26%22%7D&selection=%5B%2210%22%5D'

      const expectedSearchParams = {
        filters: {
          dateRange: ['2021-10-17T21:00:00.000Z', '2021-10-20T20:59:59.999Z'],
          engines: ['TESSERACT'],
          search: '&',
          states: ['inReview'],
          title: '-',
          types: ['type2'],
        },
        selection: ['10'],
      }

      expect(queryStringToSearchParams(mockValudQueryString)).toEqual(expectedSearchParams)
    })
  })
})
