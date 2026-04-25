
import styled from 'styled-components'
import { RadioGroup } from '@/components/Radio'

export const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  
  && .ant-radio-button-wrapper {
    display: flex;
    justify-content: center;
    width: auto;
    background-color: ${(props) => props.theme.color.grayscale14};
    color: ${(props) => props.theme.color.primary2};
    border: 1px solid ${(props) => props.theme.color.grayscale21};
    font-weight: 600;
    
    &:not(:first-child):before {
      display: none;
    }

    &-checked {
      background-color: ${(props) => props.theme.color.primary2};
      color: ${(props) => props.theme.color.primary3};
      border: 1px solid ${(props) => props.theme.color.primary2};
      
      &:hover {
        background-color: ${(props) => props.theme.color.primary2};
        border-color: ${(props) => props.theme.color.grayscale21};
      }
      
      &:before {
        background-color: ${(props) => props.theme.color.primary2};
      }
    }
    
    &:focus-within {
      box-shadow: none;
    }
  }
`
