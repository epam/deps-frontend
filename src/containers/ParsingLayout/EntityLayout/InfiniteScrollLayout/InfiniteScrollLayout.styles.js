
import styled from 'styled-components'
import { Spin } from '@/components/Spin'
import { InfiniteScroll } from '@/containers/InfiniteScroll'

const StyledInfiniteScroll = styled(InfiniteScroll)`
  height: 0.5rem;
  margin-block: 0.1rem;
`

const Spinner = styled(Spin)`
  width: 100%;
  margin-top: 1rem;
`

export {
  StyledInfiniteScroll as InfiniteScroll,
  Spinner,
}
