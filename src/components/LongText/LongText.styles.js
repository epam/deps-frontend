
import styled from 'styled-components'

export const Text = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Wrapper = styled.div`
  max-width: 100%;
  overflow: hidden;
`

export const MultilineText = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Open Sans', sans-serif;
  margin: 0;
`
