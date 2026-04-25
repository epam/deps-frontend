
import styled from 'styled-components'
import { ANIMATION } from '@/constants/styles'

const CommandBar = styled.div`
  display: flex;
  align-items: center;
  margin: 0;

  ${ANIMATION.animationAppearScaleFromZero}
`

const Command = styled.span`
  margin: 0 0.2rem;
`

const CommandsSeparator = styled.div`
  height: 2.5rem;
  width: 1px;
  margin: 0 0.6rem;
  background-color: ${(props) => props.theme.color.grayscale1Darker};
`

export {
  CommandBar,
  Command,
  CommandsSeparator,
}
