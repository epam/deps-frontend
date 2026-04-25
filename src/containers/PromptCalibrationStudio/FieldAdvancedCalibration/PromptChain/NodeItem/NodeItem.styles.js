
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { LongText } from '@/components/LongText'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 4.8rem;
  padding: 0 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${(props) => props.theme.color.grayscale17};
  background-color: ${(props) => props.theme.color.primary3};
  border-radius: 8px;
  color: ${(props) => props.theme.color.grayscale16};
  font-weight: 600;
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: ${(props) => props.theme.color.primary2};
    background-color: ${(props) => props.theme.color.grayscale20};
  }
`

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-left: 1px solid ${(props) => props.theme.color.grayscale17};
  padding-left: 0.8rem;
`

export const Name = styled(LongText)`
  max-width: 100%;
  color: ${(props) => props.theme.color.grayscale18};
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 90%;
  align-items: flex-start;
  flex: 1;
  font-size: 1.2rem;
`

export const PromptNumber = styled.span`
  display: inline-flex;
  align-items: center;
  height: 2.4rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.color.grayscale17};
  margin-right: 1.2rem;
  padding: 0.2rem 1.2rem 0 0;
  border-right: 1px solid ${(props) => props.theme.color.grayscale17};
`

export const Prompt = styled(LongText)`
  width: 100%;
  color: ${(props) => props.theme.color.grayscale11};
`

export const StyledIconButton = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.4rem;
  color: ${(props) => props.theme.color.grayscale12};
`
