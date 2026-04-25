
import styled from 'styled-components'
import { Pagination } from '@/components/Pagination'
import { Spin } from '@/components/Spin'

const StyledPagination = styled(Pagination)`
  && {
    position: relative;
    padding: 1rem 0;
    box-shadow: 0 -2px 6px ${(props) => props.theme.color.shadow1};
  }
`

const SpinWrapper = styled(Spin)`
  height: calc(100% - 6rem);
  
  .ant-spin-container {
    height: 100%;
  }

  .konvajs-content {
    height: 100% !important;
  }
`

export {
  StyledPagination as Pagination,
  SpinWrapper,
}
