
import styled from 'styled-components'
import { Collapse } from '@/components/Collapse'
import { FormItem } from '@/components/Form'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.6rem;
  margin-bottom: 1.6rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-radius: 0.8rem;
`

export const Title = styled.h4`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale18};
`

export const StyledCollapse = styled(Collapse)`
  && .ant-collapse-header,
  && .ant-collapse-content-box {
    padding-inline: 0 !important;
  }

  && .ant-collapse-header {
    color: ${(props) => props.theme.color.primary2} !important;
    font-size: 1.2rem;
    font-weight: 600;
  }
`

export const SwitchFormItem = styled(FormItem)`
  flex-direction: row;
  margin-bottom: 1.6rem;
  padding: 1.6rem;
  background: ${(props) => props.theme.color.grayscale14};
  border-radius: 0.8rem;

  & ~ div {
    margin-bottom: 0;
  }
`
