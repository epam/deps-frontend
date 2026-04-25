
import styled, { css } from 'styled-components'
import { Spin } from '@/components/Spin'

const ConversationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  ${(props) => props.$isExpanded && css`
    background-color: ${(props) => props.theme.color.grayscale14};
    border-radius: 0.8rem;
    margin: 1.6rem;
    padding: 1.6rem;
  `}
`

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ $isExpanded }) => $isExpanded ? 'auto 1fr' : '1fr'};
  flex: 1;
`

const StyledSpin = styled(Spin)`
  &, & > .ant-spin-container {
    min-height: 0;
    height: 100%;
    width: 100%;
    display: flex;
  }
`

export {
  ConversationWrapper,
  Wrapper,
  StyledSpin as Spin,
}
