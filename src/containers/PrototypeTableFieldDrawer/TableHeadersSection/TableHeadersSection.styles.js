
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { Draggable } from '@/components/Draggable'
import { FormItem } from '@/components/Form/ReactHookForm'
import { MenuOutlinedIcon } from '@/components/Icons/MenuOutlinedIcon'
import { Input } from '@/components/Input'
import { CustomSelect } from '@/components/Select'
import { Tag } from '@/components/Tag'
import { Localization, localize } from '@/localization/i18n'

const DraggableItem = styled(Draggable)`
  display: flex;
  flex-flow: column;
  gap: 4px;

  &:hover {
    border: none;
    box-shadow: none;
  }
`

const StyledFormItem = styled(FormItem)`
  margin: 0;
`

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  gap: 1.6rem;
  background-color: ${(props) => props.theme.color.primary3};
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 0.8rem;
  padding: 1.6rem;
`

const HeaderTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  & + div[data-error] {
    margin-left: 2.2rem;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

const RequiredMark = styled.span`
  display: inline-block;
  margin-right: 0.4rem;
  color: ${(props) => props.theme.color.errorDark};
  font-size: 1.4rem;
`

const Title = styled.span`
  color: ${(props) => props.theme.color.grayscale18};
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 2.2rem;
`

const StyledInput = styled(Input)`
  border: 1px solid transparent;
  background: none;
  color: ${(props) => props.theme.color.grayscale11};
  font-weight: 600;

  ${(props) => props.$hasError && css`
    border: 1px solid ${props.theme.color.error};
  `}

  &:hover {
    color: ${(props) => props.theme.color.primary2};
    border: 1px solid transparent;
    cursor: pointer;
    box-shadow: none;
  }

  &:focus {
    border: 1px solid ${(props) => props.theme.color.primary2};
    color: ${(props) => props.theme.color.grayscale11};
    cursor: auto;
    box-shadow: none;
    outline: none;
  }
`

const StyledIconButton = styled(Button.Icon)`
  width: 2.1rem;
  height: 2.4rem;
  color: ${(props) => props.theme.color.grayscale12};
`

const HeaderNameIcon = styled(MenuOutlinedIcon)`
  cursor: pointer;
  
  & > svg {
    fill: ${(props) => props.theme.color.grayscale12};
  }

  &:hover {
    & > svg {
      fill: ${(props) => props.theme.color.primary2};
    }
  }
`
const StyledCustomSelect = styled(CustomSelect)`
  .ant-select-selector {
    padding: 0.8rem 0.8rem 0.8rem 1.2rem;
  }
  
  &.ant-select-focused {
    && > .ant-select-selector {
      border-color: ${(props) => props.theme.color.primary2};
      box-shadow: none;
      outline: 0;
    }
  }
`

const AliasTag = styled(Tag)`
  min-height: 3rem;
  position: relative;

  ${(props) => props.$isEmptyTag && css`
    min-width: ${props.closable ? '12.8rem' : '11rem'};
    min-height: 3rem;
    background-color: ${(props) => props.theme.color.primary3};
    color: ${(props) => props.theme.color.grayscale22};

    &::after {
      content: "${localize(Localization.EMPTY_NAME)}";
      position: absolute;
    }

    .ant-tag-close-icon {
      margin-left: auto;
    }
  `}
`

export {
  DraggableItem,
  HeaderNameIcon,
  HeaderTitleWrapper,
  StyledCustomSelect as CustomSelect,
  StyledFormItem as FormItem,
  StyledInput as Input,
  StyledIconButton as IconButton,
  Title,
  TitleWrapper,
  Wrapper,
  RequiredMark,
  AliasTag,
}
