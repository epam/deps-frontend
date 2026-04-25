
import styled from 'styled-components'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'
import { List } from '@/components/List'
import { Modal } from '@/components/Modal'

const ListItem = styled(List.Item)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 11.4rem;
  padding: 0;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.color.grayscale20};
  }
`

const StyledModal = styled(Modal)`
  &.ant-modal {
    position: fixed;
    top: 25rem;
    right: 2.4rem;
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
  }
`

const StyledPlusIcon = styled(NewPlusIcon)`
  margin-right: 1rem;
`

export {
  StyledModal as Modal,
  ListItem,
  StyledPlusIcon as PlusIcon,
}
