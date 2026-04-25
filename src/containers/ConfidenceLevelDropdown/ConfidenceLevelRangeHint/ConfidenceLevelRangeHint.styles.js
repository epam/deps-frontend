
import styled, { css } from 'styled-components'
import { ConfidenceLevel } from '@/enums/ConfidenceLevel'

const HintItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
`

const Round = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  ${(props) => {
    switch (props.type) {
      case ConfidenceLevel.LOW:
        return css`background-color: ${props.theme.color.error};`

      case ConfidenceLevel.MEDIUM:
        return css`background-color: ${props.theme.color.warning};`

      case ConfidenceLevel.HIGH:
        return css`background-color: ${props.theme.color.success};`

      case ConfidenceLevel.NOT_APPLICABLE:
        return css`background-color: ${props.theme.color.grayscale22};`

      default:
        return css`
          background-color: unset;
          margin: 0.2rem;
        `
      }
  }}
`

const TextValue = styled.span`
  margin-left: 0.8rem;
  color: ${(props) => props.theme.color.grayscale18};
  font-weight: 600;
`

const PercentageRatio = styled.span`
  margin-left: 0.8rem;
  color: ${(props) => props.theme.color.grayscale22};
`

export {
  HintItem,
  Round,
  TextValue,
  PercentageRatio,
}
