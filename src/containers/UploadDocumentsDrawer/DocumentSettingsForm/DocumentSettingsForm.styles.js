
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Form, FormItem } from '@/components/Form'
import { CircleExclamationIcon } from '@/components/Icons/CircleExclamationIcon'

export const StyledFormItem = styled(FormItem)`
  grid-column: span 2;

  &:has(input[type="checkbox"]) {
    display: inline-flex;
    grid-column: auto;
  }
`

export const ClassificationFormItem = styled(StyledFormItem)`
  display: inline-flex;
  margin-bottom: 1.6rem;
  grid-column: auto;
  flex-direction: row;
  justify-self: start;

  & > div {
    font-size: 1.4rem;
    margin-right: 1.2rem;
  }
`

export const StyledForm = styled(Form)`
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
  flex-basis: 50%;
  width: calc(50% - 2.4rem);
`

export const SectionWrapper = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

export const SectionLabel = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
  text-transform: uppercase;
`

export const CollapseWrapper = styled.div`
  grid-column: 1 / -1;
  border-radius: 0.8rem;
  background-color: ${({ theme }) => theme.color.grayscale14};

  .ant-collapse-header {
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 600;
    line-height: 2.5rem;
    padding: 1.6rem !important;
  }
    
  .ant-collapse-content {
    border-top: 1px solid ${({ theme }) => theme.color.grayscale15} !important;
  }
  
  .ant-collapse-content-box {
    padding: 1.6rem;
  }
`

export const CollapseContent = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 1.6rem;
`

export const LabelWithIcon = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

export const InfoIcon = styled(CircleExclamationIcon)`
  display: flex;
  color: ${(props) => props.theme.color.grayscale12};
  cursor: help;
`

export const ExpandIconButton = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;

  &,
  :hover,
  :active,
  :focus {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
`
