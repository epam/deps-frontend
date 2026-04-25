
import styled from 'styled-components'
import { LongText } from '@/components/LongText'

const CardWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 8px;
  box-shadow: none;
  padding: 1.6rem;
  background-color: ${(props) => props.theme.color.primary3};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.color.grayscale18};
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
  margin-bottom: 1.2rem;
`

const HeaderLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-width: 70%;
`

const HeaderRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`

const RuleName = styled(LongText)`
  font-weight: 600;
  line-height: 2.4rem;
`

const IssueMessage = styled(LongText)`
  font-size: 1.2rem;
  font-weight: 400;
  padding-bottom: 1.2rem;
`

const Severity = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale12};
`

const FieldsList = styled.div`
  margin-top: 1.2rem;
`

const VerticalLine = styled.div`
  width: 1px;
  height: 2.4rem;
  background-color: ${(props) => props.theme.color.grayscale1};
`

export {
  CardWrapper,
  FieldsList,
  Header,
  HeaderLeftSection,
  HeaderRightSection,
  IssueMessage,
  RuleName,
  Severity,
  VerticalLine,
}
