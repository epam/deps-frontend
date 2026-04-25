
import styled from 'styled-components'

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0;
  padding: 1.2rem;
  border: 1px solid ${(props) => props.theme.color.warning};
  border-radius: 4px;
`

export const ErrorTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => props.theme.color.text};
`

export const ErrorMessage = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.color.textSecondary};
  line-height: 1.5;
`
