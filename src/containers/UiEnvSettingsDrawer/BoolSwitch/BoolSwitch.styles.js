
import styled from 'styled-components'
import { LongText } from '@/components/LongText'

export const Label = styled(LongText)`
  font-size: 1.4rem;
  line-height: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.primary4};
`

export const EnvInlineWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 0.8rem;
  justify-content: space-between;
  padding: 0.8rem 1.6rem;
  border-radius: 0.8rem;
  background-color: ${(props) => props.theme.color.grayscale14};
`
