
import styled from 'styled-components'
import { InView } from '@/containers/InView'

const StyledInView = styled(InView)`
  height: fit-content;

  &:has(.ant-spin) {
    min-height: 100%;
    display: flex;
    justify-content: center;

    &:first-child {
      align-items: center;
    }
  }
`

const FullHeightWrapper = styled.div`
  height: 100%;
  overflow-x: auto;
`

export {
  FullHeightWrapper,
  StyledInView,
}
