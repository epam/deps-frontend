
import styled from 'styled-components'
import { Input } from '@/components/Input'
import { InputNumber as AntInputNumber } from '@/components/InputNumber'
import { PageSpanSection } from '@/containers/PageSpanSection'

export const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.6rem 2.4rem;
  overflow-y: auto;
`

export const InputNumber = styled(AntInputNumber)`
  width: 100%;
`

export const TextArea = styled(Input.TextArea)`
  border-radius: 0.8rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2.2rem;
  padding: 1.6rem;
`

export const StyledPageSpanSection = styled(PageSpanSection)`
  flex-direction: column;
  gap: 1.5rem;

  & .ant-radio-group {
    margin-right: 0;
  }

  & .ant-radio-button-wrapper {
    flex: 1;
  }

  & .ant-input-number {
    width: 11rem;
  }
`
