
import styled from 'styled-components'

export const FieldsHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.6rem;
  gap: 1.6rem;
`

export const FieldsHeaderText = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2.2rem;
  color: ${({ theme }) => theme.color.grayscale18};
  margin-right: auto;
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`
