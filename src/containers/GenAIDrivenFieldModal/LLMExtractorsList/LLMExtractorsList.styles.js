
import styled from 'styled-components'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { CustomCollapse } from '@/components/Collapse/CustomCollapse'

const { Icon } = Button

const StyledCollapse = styled(CustomCollapse)`
  display: flex;
  gap: 1.6rem;
  flex-direction: column;
`

const StyledPanel = styled(CustomCollapse.Panel)`
  width: 100%;
  min-height: 8.4rem;
  border-radius: 8px !important;
  background: ${(props) => props.theme.color.grayscale14};
  cursor: pointer;

  .ant-collapse-header {
    cursor: default !important;
    padding: 1.6rem !important;
  }
  
  .ant-collapse-content-box {
    padding: 1.6rem !important;
    border-top: 1px solid ${(props) => props.theme.color.grayscale15};
  }
`

const HeaderWrapper = styled.div`
  padding-right: 3.6rem;
  width: 100%;
`

const StyledIconButton = styled(Icon)`
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;
  
  & path {
    fill: ${(props) => props.theme.color.grayscale12};
  }

  &,
  :hover,
  :active,
  :focus {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
`

const ExtractionName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  padding: 1px 0;
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem;
  line-height: 2.2rem;
`

const ExtractionParamsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
`

const ExtractionParam = styled(Badge)`
  display: flex;
  gap: 0.8rem;
  background-color: ${(props) => props.theme.color.grayscale20};
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.4rem;
  color: ${(props) => props.theme.color.grayscale12};
  font-weight: 400;
  line-height: 2.2rem;
  padding: 0.4rem 1.6rem;

  > span {
    font-weight: 600;
    color: ${(props) => props.theme.color.grayscale18};
  }
`

const Instruction = styled.pre`
  color: ${(props) => props.theme.color.grayscale12};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2.2rem;
  font-family: 'Open Sans', sans-serif;
  margin: 0;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`

const LLMType = styled.div`
  color: ${(props) => props.theme.color.grayscale11};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 2rem;
  padding: 2px 0;
`

export {
  ExtractionName,
  ExtractionParamsWrapper,
  ExtractionParam,
  HeaderWrapper,
  Instruction,
  LLMType,
  StyledCollapse as Collapse,
  StyledPanel as Panel,
  StyledIconButton,
}
