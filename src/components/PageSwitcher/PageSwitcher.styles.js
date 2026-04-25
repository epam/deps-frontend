
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'

export const SelectStyled = styled(Select)`
  width: 7rem;
  font-size: 1.2rem;
  margin: 0 3px;

  &.ant-select .ant-select-selector {
    height: 2.4rem;
    align-items: center;
    padding: 0 2px;
    text-align: center;
  }  
`

export const Switcher = styled.div`
  display: inline-flex;
  align-items: center;
`

export const Splitter = styled.span`
  font-size: 1.4rem;
  padding: 0 1rem 0.2rem 1rem;

  ${(props) => props.disabled && css`
    color: ${props.theme.color.grayscale1Darker};
    cursor: default;
  `}
`

export const PagesQuantity = styled.span`
  font-size: 1.4rem;

  ${(props) => props.disabled && css`
    color: ${props.theme.color.grayscale1Darker};
    cursor: default;
  `}
`

export const PaginationButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;

  :disabled {
    opacity: 0;
    overflow: hidden;
  }
`
