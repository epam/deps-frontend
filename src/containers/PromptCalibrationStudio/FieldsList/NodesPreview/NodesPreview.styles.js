
import styled, { css } from 'styled-components'
import { AIMicrochipIcon } from '@/components/Icons/AIMicrochipIcon'
import { ErrorTriangleIcon } from '@/components/Icons/ErrorTriangleIcon'
import { SitemapIcon } from '@/components/Icons/SitemapIcon'

export const Wrapper = styled.div`
  max-height: 15rem;
  padding-inline: 0.5rem;
  overflow-y: auto;
`

export const ContentWrapper = styled.div`
  display: flex;
  font-size: 1.2rem;
  color: ${(props) => props.theme.color.grayscale18};
`

export const SinglePromptText = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6rem;
  margin-bottom: 0.8rem;
  max-height: 15rem;
  padding-inline: 0.5rem;
  overflow-y: auto;
`

export const NodePrompt = styled(SinglePromptText)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const NodeName = styled.div`
  font-size: 1rem;
  font-weight: 700;
`

export const WarningTriangleIcon = styled(ErrorTriangleIcon)`
  width: 2.4rem;
  color: ${({ theme }) => theme.color.warning};
  cursor: pointer;
`

export const IconsStyles = css`
  width: 2.4rem;
  
  path {
    fill: ${({ theme }) => theme.color.grayscale12};
  }
  
  &:hover {
    cursor: pointer;

    path {
      fill: ${({ theme }) => theme.color.grayscale19};
    }
  }
`

export const MicrochipIcon = styled(AIMicrochipIcon)`
  ${IconsStyles}
`

export const MapIcon = styled(SitemapIcon)`
  ${IconsStyles}
`
