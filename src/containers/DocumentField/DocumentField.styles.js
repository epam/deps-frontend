
import styled, { css } from 'styled-components'
import { FieldLabel } from '@/components/FieldLabel'
import { TextAreaField } from '@/components/TextAreaField'

const List = styled.ul`
  display: list-item;
  li {
    list-style-type: disc;
    margin-left: 2rem;
  }
`

const StyledFieldLabel = styled(FieldLabel)`
  padding: 0;
  width: auto;

  & > span {
    color: ${(props) => props.theme.color.grayscale11};
    font-size: 1.2rem;
  }
`

const FieldWrapper = styled.div`
  padding: 1.6rem;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
`

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

const PrimitiveFieldContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`

const FieldInputWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  padding-right: 0.8rem;
  position: relative;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 4px;
  transition: all 0.5s;

  ${({ theme, disabled }) => disabled && css`
    background-color: ${theme.color.grayscale14};
    border-color: ${theme.color.grayscale14};
    color: ${theme.color.grayscale22};
  `}

  ${(props) => props.hasWarnings && css`
    border: 1px solid ${props.theme.color.warning};
  `}

  ${(props) => props.hasErrors && css`
    border: 1px solid ${props.theme.color.error};
  `}
  
  &:hover {
    border-color: ${(props) => props.theme.color.primary2};

    ${({ theme, disabled }) => disabled && css`
      border-color: ${theme.color.grayscale14};
    `}

    ${(props) => props.hasWarnings && css`
      border-color: ${(props) => props.theme.color.warning};
    `}

    ${(props) => props.hasErrors && css`
      border-color: ${(props) => props.theme.color.error};
    `}
  }
  
  &:focus-within {
    border-color: ${(props) => props.theme.color.primary2};

    ${(props) => props.hasWarnings && css`
      border-color: ${(props) => props.theme.color.warning};
    `}

    ${(props) => props.hasErrors && css`
      border-color: ${(props) => props.theme.color.error};
    `}
  }
`

const StyledTextAreaField = styled(TextAreaField)`
  border: none;
  color: ${(props) => props.theme.color.grayscale18};
  overflow: hidden;
  padding: 0.5rem 3.2rem 0.5rem 0.8rem;
  resize: none;
  scrollbar-gutter: stable;

  &[disabled] {
    background-color: transparent;
    color: ${(props) => props.theme.color.grayscale22};
  }
  
  &:hover {
    border: none !important;
  }

  &:focus {
    border: none;
    box-shadow: none;
  }

  &::-webkit-scrollbar {
    width: 0.6rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.color.grayscale11};
  }
`

const TextAreaIconsWrapper = styled.div`
  display: grid;
  justify-items: center;
  height: 100%;
  position: absolute;
  right: 0.8rem;
  padding: 0.8rem 0;
`

export {
  StyledFieldLabel as FieldLabel,
  List,
  TextAreaIconsWrapper,
  FieldWrapper,
  InfoWrapper,
  ContentWrapper,
  StyledTextAreaField as TextAreaField,
  FieldInputWrapper,
  PrimitiveFieldContent,
}
