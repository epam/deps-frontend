
import { withSize } from 'react-sizeme'
import styled from 'styled-components'

const FullSize = styled.div`
  width: 100%;
  height: 100%;
`

const DEFAULT_ROUND_WIDTH = 100

const withParentSize = (options) => (ConnectedComponent) => withSize(options)((props) => (
  <FullSize>
    <ConnectedComponent {...props} />
  </FullSize>
))

const withFlexibleParentSize = ({
  height,
  roundWidth = DEFAULT_ROUND_WIDTH,
  ...options
}) => (ConnectedComponent) => {
  const SizeWrapper = withSize(options)((props) => {
    const { size, ...restProps } = props

    const roundedSize = roundWidth && size.width
      ? {
        ...size,
        width: Math.round(size.width / roundWidth) * roundWidth,
      }
      : size

    return (
      <FullSize style={{ height: height }}>
        <ConnectedComponent
          {...restProps}
          size={roundedSize}
        />
      </FullSize>
    )
  })

  return SizeWrapper
}

export {
  withParentSize,
  withFlexibleParentSize,
}
