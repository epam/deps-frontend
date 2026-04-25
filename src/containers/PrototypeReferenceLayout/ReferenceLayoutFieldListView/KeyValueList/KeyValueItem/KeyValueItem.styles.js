
import styled, { css } from 'styled-components'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'

const activeStyles = css`
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => props.theme.color.primary2};
`

const FieldTitle = styled.p`
  font-weight: 600;
  margin-bottom: 0;
`

const FieldValue = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  background-color: ${(props) => props.theme.color.primary5};
  border-radius: 5px;
  min-height: 3.2rem;

  ${(props) => props.$active && activeStyles}
`

const FieldWrapper = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: space-between;
`

const ValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 45%;
`

const ButtonIcon = styled(Button.Icon)`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 5px;
  border-color: ${(props) => props.theme.color.grayscale1};
  
  &:hover,
  &:active {
    background-color: ${(props) => props.theme.color.primary3};
  }

  ${(props) => props.$active && activeStyles}
`

const StyledBadge = styled(Badge)`
  & > svg {
    path {
      fill: ${(props) => props.theme.color.success};
    }
  }
`

export {
  FieldWrapper,
  FieldTitle,
  FieldValue,
  ValueWrapper,
  ButtonIcon,
  StyledBadge,
}
