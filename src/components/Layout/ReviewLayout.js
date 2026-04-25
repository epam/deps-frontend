
import styled from 'styled-components'
import { Layout } from './Layout'

const ReviewLayout = styled(Layout)`
  background-color: ${(props) => props.theme.color.primary5};
  
  .ant-layout-content {
    background-color: ${(props) => props.theme.color.primary3};
  }

  .ant-layout-content .ant-row {
    height: 100%;
  }
`

export {
  ReviewLayout,
}
