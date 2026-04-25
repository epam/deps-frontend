
import styled from 'styled-components'
import { IconButton } from '@/components/Button/IconButton'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  max-width: 60%;
`

export const FieldTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-width: 80%;
`

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

export const Hint = styled.span`
  font-size: 1.2rem;
  line-height: 1;
  color: ${({ theme }) => theme.color.grayscale11};
`

export const Divider = styled.div`
  flex-shrink: 0;
  height: 2.4rem;
  width: 1px;
  background-color: ${({ theme }) => theme.color.grayscale1};
`

export const StyledIconButton = styled(IconButton)`
  width: 2.4rem;
  height: 2.4rem;
  color: ${({ theme }) => theme.color.grayscale12};
`
