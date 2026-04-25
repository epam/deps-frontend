
import { renderHook } from '@testing-library/react-hooks'
import { useTooltip } from './useTooltip'

test('should return expected api', () => {
  const { result } = renderHook(() => useTooltip({ title: 'Test Tooltip' }))

  const {
    showTooltip,
    hideTooltip,
    renderTooltip,
  } = result.current

  expect(showTooltip).toEqual(expect.any(Function))
  expect(hideTooltip).toEqual(expect.any(Function))
  expect(renderTooltip).toEqual(expect.any(Function))
})
