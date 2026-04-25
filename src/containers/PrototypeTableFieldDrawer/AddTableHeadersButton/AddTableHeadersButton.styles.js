
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { PlusCircleIcon } from '@/components/Icons/PlusCircleIcon'

const PlusIcon = styled(PlusCircleIcon)`
  color: ${(props) => props.theme.color.primary2};
  margin-right: 0.5rem;

  ${(props) => props.disabled && css`
      color: ${props.theme.color.grayscale1Darker};
  `}
`

const StyledButton = styled(Button.Link)`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  text-decoration: none;
  margin-left: auto;

  ${(props) => props.disabled && css`
    color: ${props.theme.color.grayscale1Darker} !important;
  `}
`

export {
  PlusIcon,
  StyledButton as Button,
}
