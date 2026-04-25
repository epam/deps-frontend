
import styled from 'styled-components'

const DRAGGER_SIZE = 0.5
const DRAGGER_OFFSET = -(DRAGGER_SIZE / 20)

const TopDragger = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  cursor: n-resize;
  top: ${DRAGGER_OFFSET}rem;
  height: ${DRAGGER_SIZE}rem;
`

const BottomDragger = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  cursor: s-resize;
  bottom: ${DRAGGER_OFFSET}rem;
  height: ${DRAGGER_SIZE}rem;
`

const LeftDragger = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  cursor: w-resize;
  left: ${DRAGGER_OFFSET}rem;
  width: ${DRAGGER_SIZE}rem;
`

const RightDragger = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  cursor: e-resize;
  right: ${DRAGGER_OFFSET}rem;
  width: ${DRAGGER_SIZE}rem;
`

const Region = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export {
  Region,
  TopDragger,
  BottomDragger,
  LeftDragger,
  RightDragger,
}
