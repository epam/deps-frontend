
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'
import { List } from '@/components/List'
import { Modal } from '@/components/Modal'

const baseListItemStyles = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.6rem;
`

const ListItem = styled(List.Item)`
  ${baseListItemStyles}
  
  &:hover {
    background-color: ${(props) => props.theme.color.grayscale20};
    cursor: pointer;
  }
`

const Title = styled.h3`
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem; 
  font-weight: 600;
`

const Description = styled.p`
  color: ${(props) => props.theme.color.grayscale11};
  font-size: 1.2rem;
  margin-bottom: 0;
`

const DisabledListItem = styled(List.Item)`
  cursor: not-allowed;
  ${baseListItemStyles}
  
  &&& {
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale20};
  }

  ${Title}, ${Description} {
    color: ${(props) => props.theme.color.grayscale22};
  }
`

const DocTypeModal = styled(Modal)`
  &.ant-modal {
    position: fixed;
    top: 12.8rem;
    right: 1.9rem;
  }

  .ant-modal-content {
    height: fit-content;
    max-height: 36rem;
    overflow: auto;

    @media (min-height: 640px) {
      max-height: 52rem;
    }
  }

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-header {
    padding: 1.6rem;
  }

  .ant-modal-title {
    color: ${(props) => props.theme.color.grayscale18};
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 22px;
  }
`

const StyledNewPlusIcon = styled(NewPlusIcon)`
  margin-right: 1rem;
`

const TriggerButton = styled(Button)`
  ${(props) => props.$focused && css`
    background-color: ${(props) => props.theme.color.primary2Darker};
  `}
`

export {
  DocTypeModal,
  ListItem,
  DisabledListItem,
  Title,
  Description,
  StyledNewPlusIcon as NewPlusIcon,
  TriggerButton,
}
