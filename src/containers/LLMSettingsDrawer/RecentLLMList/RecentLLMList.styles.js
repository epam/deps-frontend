
import styled from 'styled-components'
import { Collapse } from '@/components/Collapse'

export const StyledCollapse = styled(Collapse)`
  && {
    margin-bottom: 1.6rem;
    background-color: ${(props) => props.theme.color.grayscale14};
  }

  && .ant-collapse-item {
    border: 0;
  }

  && .ant-collapse-item .ant-collapse-header {
    padding-block: 1.7rem;
    font-weight: 600;
    border-radius: 8px;
  }

  && .ant-collapse-item .ant-collapse-content {
    background-color: ${(props) => props.theme.color.primary3};
  }

  && .ant-collapse-item .ant-collapse-content > div {
    padding: 1.6rem 0 0.1rem;
  }

  && .ant-collapse-content-box > div:last-child {
    margin-bottom: 0;
  }
`
