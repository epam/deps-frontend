
import styled from 'styled-components'
import { Alert } from '@/components/Alert'

const StyledAlert = styled(Alert)`
  background-color: ${(props) => props.theme.color.grayscale18};
  border-radius: 1.2rem;
  margin-bottom: 1.6rem;
  padding: 1.6rem;

  & > svg {
    margin: 2px 6px 0 0;
  }

  .ant-alert-message {
    color: ${(props) => props.theme.color.primary3};
    font-size: 1.4rem;
    font-weight: 600;
  }
  
  .ant-alert-description {
    color: ${(props) => props.theme.color.grayscale15};
    font-weight: 400;
    margin: 0 -1.6rem 0 -2.4rem;
  }

  &.ant-alert-with-description .ant-alert-icon {
    font-size: 1.6rem;
    margin-right: 6px;
  }
  
  .ant-alert-close-icon .anticon-close {
    color: ${(props) => props.theme.color.primary3};
  }
`

export {
  StyledAlert as Alert,
}
