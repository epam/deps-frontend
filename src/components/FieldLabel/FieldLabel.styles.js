
import styled, { css } from 'styled-components'

const baseActiveLabelStyles = css`
  font-weight: bold;
  text-decoration: underline;
`

export const Label = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.4rem;
  & > span {
    cursor: default;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    ${(props) => props.$active && baseActiveLabelStyles}
  }

  ${(props) => props.$clickable && css`
    & > span:hover {
      cursor: pointer;
      ${baseActiveLabelStyles}
    }
  `}
`

export const RequiredLabel = styled.span`
  display: inline-block;
  margin-right: 0.4rem;
  color: ${(props) => props.theme.color.errorDark};
  font-size: 0.875rem;
  line-height: 1;
`

export const Wrapper = styled.span`
  display: flex;
  align-items: center;
`
