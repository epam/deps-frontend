
import styled, { css } from 'styled-components'
import { FlagType } from '@/components/Flag/FlagType'

const FlagComponent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.6rem;
  width: 2.4rem;
  line-height: 1.2rem;
  font-size: 1rem;
  color: white;
  border-radius: 0.4rem;
  cursor: default;
  text-overflow: initial;

  ${(props) => {
    switch (props.type) {
      case FlagType.ERROR:
        return css`background-color: ${props.theme.color.error};`

      case FlagType.WARNING:
        return css`background-color: ${props.theme.color.warning};`

      case FlagType.INFO:
        return css`background-color: ${props.theme.color.grayScale8};`

      case FlagType.TABLE_DATA:
        return css`background-color: ${props.theme.color.primary2};`

      case FlagType.SUCCESS:
        return css`background-color: ${props.theme.color.success};`

      case FlagType.NOT_APPLICABLE:
        return css`background-color: ${props.theme.color.grayscale22};`

      default:
    }
  }}
`

export {
  FlagComponent,
}
