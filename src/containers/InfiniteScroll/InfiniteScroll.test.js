
import { mockEnv } from '@/mocks/mockEnv'
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'
import { render } from '@/utils/rendererRTL'
import { InfiniteScroll } from './InfiniteScroll'

jest.mock('@/utils/env', () => mockEnv)
const mockLoadMoreProp = jest.fn()

test('loadMore prop is called in case observed element is in view', () => {
  render(
    <InfiniteScroll
      loadMore={mockLoadMoreProp}
    />,
  )

  mockAllIsIntersecting(true)

  expect(mockLoadMoreProp).toHaveBeenCalled()
})

test('loadMore prop is not called in case observed element is not in view', () => {
  jest.clearAllMocks()

  render(
    <InfiniteScroll
      loadMore={mockLoadMoreProp}
    />,
  )

  mockAllIsIntersecting(false)

  expect(mockLoadMoreProp).not.toHaveBeenCalled()
})
