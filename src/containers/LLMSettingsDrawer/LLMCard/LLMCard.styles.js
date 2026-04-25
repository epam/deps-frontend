
import { Typography } from 'antd/es'
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { LongText } from '@/components/LongText'

const HeaderTitle = styled.h4`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 1rem;
  margin-bottom: 1.2rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale18};
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.6rem;
  margin-bottom: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale14};
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  background-color: ${(props) => props.theme.color.grayscale14};

  ${({ isActive }) => isActive && css`
    & {
      border-color: ${(props) => props.theme.color.grayscale18};
      background-color: ${(props) => props.theme.color.primary3};
    }
  `}

  &:hover {
    border-color: ${(props) => props.theme.color.grayscale19};
    background-color: ${(props) => props.theme.color.grayscale20};
  }
`

const Paragraph = styled(Typography.Paragraph)`
  && {
    margin-bottom: 0;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
`

const IconButton = styled(Button.Icon)`
  padding: 0.5rem;
  align-self: end;

  ${({ $isExpanded }) => $isExpanded && css`
    transform: rotate(180deg);
  `}
`

const Provider = styled(LongText)`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale22};
`

export {
  Card,
  Paragraph,
  HeaderTitle,
  ContentWrapper,
  IconButton,
  Provider,
}
