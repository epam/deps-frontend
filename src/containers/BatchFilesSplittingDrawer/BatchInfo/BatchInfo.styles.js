
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { List } from '@/components/List'

export const StyledList = styled(List)`
  width: 32rem;
`

export const StyledItem = styled(List.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.grayscale18};

  && {
    border-bottom: none;
  }

  && > div {
    max-width: 50%;
  }
`

export const Label = styled.span`
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.grayscale11};
`

export const IconButton = styled(Button.Icon)`
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.color.grayscale21};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.grayscale14};

  & svg {
    color: ${({ theme }) => theme.color.primary2};
  }
`
