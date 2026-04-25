
import styled from 'styled-components'
import { Button } from '@/components/Button'
import './UploadEntitiesPopover.css'

export const PopoverContainer = styled.div`
  width: 32rem;
  display: flex;
  flex-direction: column;
`

export const PopoverTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 1.6rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayscale15};
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2.2rem;
  color: ${({ theme }) => theme.color.grayscale18};
`

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

export const OptionItem = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 0.4rem;
  align-items: center;
  padding: 1.6rem;
  border-bottom: 0.1rem solid ${({ theme }) => theme.color.grayscale15};
  color: ${({ theme }) => theme.color.grayscale18};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.color.grayscale20};
  }
`

export const OptionTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`

export const OptionDescription = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.color.grayscale11};
`

export const StyledButton = styled(Button)`
  display: flex;
  padding: 1.2rem 2rem;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
`

export const IconWrapper = styled.div`
  display: flex;
  padding: 0.2rem 0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
