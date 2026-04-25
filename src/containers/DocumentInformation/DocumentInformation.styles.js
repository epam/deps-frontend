
import styled, { css } from 'styled-components'
import { List } from '@/components/List'
import { ManageLabelsModalButton as _ManageLabelsModalButton } from '@/containers/ManageLabelsModalButton'

export const ManageLabelsModalButton = styled(_ManageLabelsModalButton)`
  height: 2.2rem;
  font-size: 2.2rem;
  line-height: 1;
  border-style: none;
  font-weight: 700;
  padding: 0 0.5rem;

  &:hover {
    cursor: pointer;
  }
`

export const Label = styled.span`
  color: ${(props) => props.theme.color.grayscale10};
  padding-left: 1rem;
  cursor: default;
`

export const Info = styled.div`
  padding-right: 1rem;
  cursor: default;
  text-align: end;
`

export const ListInfo = styled(List)`
  .ant-list-item-content-single {
    border-bottom: 0.1rem solid ${(props) => props.theme.color.secondaryLight};
  }

  .ant-list-item {
    padding: 0.4rem 0;
    margin-bottom: 0;
    justify-content: space-between;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }
`

export const ErrorInfo = styled.pre`
  max-height: 0;
  overflow: hidden;
  padding: 0 2.5rem;
  transition: max-height 0.5s;

  ${(props) => props['data-visidility'] && css`
    max-height: 80rem;
  `}
`

export const ErrorLabel = styled.span`
  cursor: default;
  padding-left: 0;
`

export const ClickableListItem = styled(List.Item)`
  cursor: pointer;
  margin-left: 2.5rem;
`

export const ClickableErrorLabel = styled.span`
  cursor: pointer;
  padding-left: 0;
`

export const ErrorListItem = styled(List.Item)`
  .ant-list-item-content-single {
    border-bottom: none;
  }
`

export const ErrorItem = styled(List.Item)`
  margin-left: 2.5rem;
`

export const HiddenListItem = styled(List.Item)`
  .ant-list-item-content-single {
    border-bottom: none;
  }
`
