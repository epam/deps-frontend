
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const SinglePromptText = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6rem;
  margin-bottom: 0.8rem;
`

export const PromptChainText = styled(SinglePromptText)`
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

export const ActionButton = styled(Button)`
  color: ${(props) => props.theme.color.grayscale18};
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0;
  height: 2rem;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.6rem;

  & > svg {
    width: 2.4rem;
    path {
      fill: ${(props) => props.theme.color.grayscale12};
    }
  }
  
  &:focus {
    color: ${(props) => props.theme.color.grayscale18};
  }
  
  &:hover {
    color: ${(props) => props.theme.color.primary2};

    & > svg {
      path {
        fill: ${(props) => props.theme.color.grayscale19};
      }
    }
  }
`
