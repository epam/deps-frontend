
import styled, { css } from 'styled-components'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { LongText } from '@/components/LongText'
import { Tag } from '@/components/Tag'
import { Tooltip } from '@/components/Tooltip'
import { Localization, localize } from '@/localization/i18n'

const emptyTagStyle = css`
  position: relative;
  background-color: ${({ theme }) => theme.color.primary3};
  color: ${({ theme }) => theme.color.grayscale22};

  &::after {
    content: "${localize(Localization.EMPTY_NAME)}";
    position: absolute;
  }
`

const Wrapper = styled.div`
  display: flex;
  width: 100%;

  & > span:last-of-type {
    margin-left: auto;
  }

  & .ant-tooltip-arrow {
    display: none;
  }

  & .ant-tooltip {
    max-width: none;

    & .ant-tooltip-inner {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
      justify-content: space-between;
      max-width: 33rem;
      background-color: ${(props) => props.theme.color.primary3};
  
      & > span,
      & > div {
        margin-right: 0;
      }
    }
  }
`

const VisibleHeadersWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 48rem;
`

const TagButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 0.4rem 1rem;
  color: ${(props) => props.theme.color.grayscale12};

  & > svg {
    margin-right: 0.5rem;
  }
`

const Counter = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(props) => props.theme.color.primary2};
`

const HiddenHeadersTooltip = styled(Tooltip)`
  background-color: ${(props) => props.theme.color.primary3};
  margin-left: 0 !important;
`

const HeaderNameTag = styled(Tag)`
  &.ant-tag {
    width: 15rem;
    height: 3rem;
    border-radius: 4px;
  }
  
  .ant-tag-close-icon {
    margin-left: auto;
  }

  ${(props) => props.$isEmpty && emptyTagStyle}
`

const HeaderName = styled(LongText)`
  margin-right: 8px;
  width: 100%;
`

const AliasesNumberBadge = styled(Badge)`
  cursor: pointer;
  margin: 0 8px;
  
  .ant-badge-count {
    font-size: 8px;
    font-weight: bold;
    color: ${(props) => props.theme.color.primary3};
    background: ${(props) => props.theme.color.primary4};
  }
`

const AliasTag = styled(Tag)`
  display: inline-block;
  margin-bottom: 0.5rem;
  height: 3rem;
  width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) => props.$isEmpty && emptyTagStyle}
`

export {
  Wrapper,
  VisibleHeadersWrapper,
  TagButton,
  Counter,
  HiddenHeadersTooltip,
  HeaderNameTag,
  HeaderName,
  AliasesNumberBadge,
  AliasTag,
}
