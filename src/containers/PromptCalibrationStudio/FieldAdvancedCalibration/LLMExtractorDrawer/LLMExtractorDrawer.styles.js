
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`

export const LLMExtractorButton = styled(Button.Secondary)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  height: 100%;
  background-color: ${(props) => props.theme.color.grayscale14};
  padding: 1.6rem;
  border-radius: 0.8rem;
`

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const StyledIconButton = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.4rem;
  color: ${({ theme }) => theme.color.grayscale12};
`
