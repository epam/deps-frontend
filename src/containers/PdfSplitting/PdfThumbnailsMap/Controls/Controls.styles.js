
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { CommandBar } from '@/components/CommandBar'
import { ComponentSize } from '@/enums/ComponentSize'

const ComponentSizeToValue = {
  [ComponentSize.SMALL]: '2.4rem',
  [ComponentSize.DEFAULT]: '3.2rem',
}

const ComponentSizeToStyles = {
  [ComponentSize.SMALL]: `
    right: 0.4rem;
    top: 0.4rem;
    gap: 0.4rem;
  `,
  [ComponentSize.DEFAULT]: `
    right: 1.2rem;
    top: 1.2rem;
    gap: 1.6rem;
  `,
}

export const StyledCommandBar = styled(CommandBar)`
  position: absolute;
  display: flex;
  justify-content: center;
  z-index: 100;

  ${(props) => css`${ComponentSizeToStyles[props.$size]}`}

  ${(props) => props.$isVertical && css`
    flex-direction: column;
  `}
`

export const StyledIconButton = styled(Button.Icon)`
  width: ${(props) => ComponentSizeToValue[props.$size]};
  height: ${(props) => ComponentSizeToValue[props.$size]};
  border: 1px solid ${(props) => props.theme.color.grayscale21};
  background: ${(props) => props.theme.color.grayscale14};
  color: ${(props) => props.theme.color.primary2};
`
