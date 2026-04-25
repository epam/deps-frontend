
import { ResponseType } from '@/enums/ResponseType'
import { apiRequest } from '@/utils/apiRequest'
import { loadImageURL } from './image'

jest.mock('@/utils/apiRequest', () => ({
  apiRequest: {
    get: jest.fn(() => Promise.resolve()),
  },
}))

describe('Utils: image', () => {
  let Image = null

  beforeAll(() => {
    Image = window.Image
    window.Image = function () {
      const instance = this
      setTimeout(
        () => {
          instance.onload && instance.onload()
        },
        0,
      )
    }
  })

  afterAll(() => {
    window.Image = Image
  })

  it('should call to apiRequest.get when calling to loadImageUrl', async () => {
    const mockUrl = 'http://image.jpeg'

    await loadImageURL(mockUrl)

    expect(apiRequest.get).toHaveBeenCalledWith(
      mockUrl,
      {
        responseType: ResponseType.BLOB,
      },
    )
  })
})
