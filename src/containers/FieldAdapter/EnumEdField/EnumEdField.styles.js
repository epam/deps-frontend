
import styled from 'styled-components'
import { FieldInputWrapper } from '@/containers/DocumentField'

const StyledFieldInputWrapper = styled(FieldInputWrapper)`
  .ant-select-dropdown {
    width: 100% !important;
    padding: 0;
    border: 1px solid ${(props) => props.theme.color.grayscale1};
    border-radius: 4px;
    box-shadow: none;
  }

  .ant-select-item {
    height: 4rem;
    padding: 0.8rem 1.2rem;
    color: ${(props) => props.theme.color.grayscale18};
    background-color: ${(props) => props.theme.color.primary3};
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};

    &:last-child {
      border: none;
    }
    
    &:hover {
      background-color: ${(props) => props.theme.color.grayscale20};
    }
  }
`

export {
  StyledFieldInputWrapper as FieldInputWrapper,
}
