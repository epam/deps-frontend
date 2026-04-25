
import styled from 'styled-components'
import { Button } from './Button'

const LinkButton = styled(Button)`
  height: auto;
  background: none;
  border: none;
  color: ${(props) => props.theme.color.primary2};
  box-shadow: none; 
  padding: 0;
  text-decoration: underline;
  cursor: pointer;

  &&&:active {
    color: ${(props) => props.theme.color.primary2Darker};
  }
  
  &&&:focus {
    background-color: transparent;
    color: ${(props) => props.theme.color.primary2};
  }

  &&&:disabled, &&&:hover {
    background-color: transparent;
    box-shadow: none;
    color: ${(props) => props.theme.color.primary2};
  }

  &&&:after {
    animation: 0s;
  }
`

export {
  LinkButton,
}
