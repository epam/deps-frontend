
const { default: styled } = require('styled-components')

const StyledSpan = styled.span`
  color: ${(props) => props.theme.color.primary4};
  opacity: 0.55;
  display: flex;
  align-items: center;
  word-break: break-word;
`

const StyledTitle = styled.span`
  color: ${(props) => props.theme.color.primary2};
  font-weight: 600;
`

const TextDivider = styled.span`
  color: ${(props) => props.theme.color.primary4};
  opacity: 0.55;
  display: flex;
  justify-content: center;
`

const InviteLinkWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 1rem;
  padding: 1.2rem 0;
`

export {
  InviteLinkWrapper,
  StyledSpan,
  StyledTitle,
  TextDivider,
}
