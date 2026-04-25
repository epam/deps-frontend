
import styled from 'styled-components'
import { LongText } from '@/components/LongText'
import { Tag } from '@/components/Tag'

export const PromptChainText = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6rem;
  margin-bottom: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const PromptName = styled.div`
  font-size: 1rem;
  font-weight: 700;
`

export const PromptsNumber = styled.div`
  font-weight: 700;
  color: ${(props) => props.theme.color.grayscale18};
`

export const TagWrapper = styled(Tag)`
  gap: 0.8rem;
  color: ${(props) => props.theme.color.grayscale12};
  cursor: default;
`

export const SinglePrompt = styled(LongText)`
  color: ${(props) => props.theme.color.grayscale18};
`

export const TagTitle = styled.span`
  color: ${(props) => props.theme.color.grayscale18};
`
