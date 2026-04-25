
import { mockEnv } from '@/mocks/mockEnv'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KeyValuePairElementLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { KeyValuePairLayout as KeyValuePairLayoutComponent } from './KeyValuePairLayout'

jest.mock('@/utils/env', () => mockEnv)

const mockKeyData = new KeyValuePairElementLayout(
  'keyContent',
  [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
)
const mockValueData = new KeyValuePairElementLayout(
  'valueContent',
  [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
)
const mockData = [
  {
    layout: {
      key: mockKeyData,
      value: mockValueData,
    },
    page: 1,
  },
  {
    layout: {
      key: mockKeyData,
      value: mockValueData,
    },
    page: 2,
  },
]

function MockInfiniteScrollLayout ({ setLayout, children }) {
  React.useEffect(() => {
    setLayout(mockData)
  }, [setLayout])
  return children
}

jest.mock('../InfiniteScrollLayout', () => ({
  InfiniteScrollLayout: MockInfiniteScrollLayout,
}))

jest.mock('./KeyValuePairField', () => ({
  KeyValuePairField: jest.fn(({ keyData, valueData, page }) => (
    <div data-testid={`kvp-field-${page}`}>
      <span>{keyData.content}</span>
      <span>{valueData.content}</span>
    </div>
  )),
}))

test('should render correct layout for key-value pairs', () => {
  render(
    <KeyValuePairLayoutComponent
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.AWS_TEXTRACT}
      total={1}
    />,
  )

  expect(screen.getByTestId('kvp-field-1')).toBeInTheDocument()
  expect(screen.getByTestId('kvp-field-2')).toBeInTheDocument()
  expect(screen.getAllByText('keyContent').length).toBe(2)
  expect(screen.getAllByText('valueContent').length).toBe(2)
})
