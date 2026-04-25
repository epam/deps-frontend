
import styled from 'styled-components'
import { Button } from './Button'

const PrimaryGradientButton = styled(Button)`
  display: flex;
  align-items: center;
  height: 3.4rem;
  font-weight: 600;
  background: ${(props) => props.theme.color.primary1};
  color: ${(props) => props.theme.color.primary3};
  border-color: transparent;

  &&&:hover {
    color: ${(props) => props.theme.color.primary3};
    background: ${(props) => props.theme.color.primary1};
    box-shadow: 0 0.4rem 1rem ${(props) => props.theme.color.primary2Light};
  }

  &&&:active, &&&:focus {
    color: ${(props) => props.theme.color.primary3};
    background: ${(props) => props.theme.color.primary1};
    border-color: transparent;
  }
  
  &&&[disabled] {
    color: ${(props) => props.theme.color.primary3};
    background: ${(props) => props.theme.color.primary1};
    opacity: 0.3;
  }    
    
  &&&[disabled]:hover {
    color: ${(props) => props.theme.color.primary3};
    background: ${(props) => props.theme.color.primary1};
  } 
`

const SecondaryGradientButton = styled(Button)`
  color: ${(props) => props.theme.color.primary2};
  border-color: ${(props) => props.theme.color.primary2};
  background: transparent;
  
  &&&:hover {
    background: ${(props) => props.theme.color.grayscale2};
  }

  &&&:active, &&&:focus {
    background: ${(props) => props.theme.color.grayscale7};
    color: ${(props) => props.theme.color.primary2};
    border-color: ${(props) => props.theme.color.primary2};
  }
  
  &&&[disabled] {
    color: ${(props) => props.theme.color.primary2};
    border-color: ${(props) => props.theme.color.primary2};
    background: transparent;
    opacity: 0.3;
  }    
    
  &&&[disabled]:hover {
    background: transparent;
  } 
`

export {
  PrimaryGradientButton,
  SecondaryGradientButton,
}
