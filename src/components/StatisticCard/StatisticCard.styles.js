
import styled from 'styled-components'
import { Progress } from '@/components/Progress'

const CardWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-end;
  font-weight: 600;
  padding: 1.6rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.color.grayscale21};
  background-color: ${(props) => props.theme.color.grayscale14};
  color: ${(props) => props.theme.color.grayscale18};
  margin-bottom: 1.6rem;

  & .ant-spin-nested-loading {
    width: 100%;
  }

  & .ant-spin-container {
    display: flex;
    align-items: end;
  }
`

const CardInfoWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const CardValuesWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 3.2rem;
  font-weight: 700;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.color.grayscale21};
  padding: 0.4rem 1.2rem;
  color: ${(props) => props.theme.color.grayscale12};
  background-color: transparent;
  margin-right: 1.2rem;
`

const CardTitle = styled.h5`
  font-size: 1.2rem;
  line-height: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
`

const CurrentValueWrapper = styled.span`
  color: ${(props) => props.theme.color.primary2};
  margin-right: 0.4rem;
`

const TotalValueWrapper = styled.span`
  margin-left: 0.4rem;
`

const StyledProgress = styled(Progress)`
  margin-right: 1.6rem;

  && .ant-progress-text {
    font-size: 1.6rem;
    font-weight: 600;
    color: ${(props) => props.theme.color.grayscale12};
  }

  && .ant-progress-circle {
    transform: rotateY(180deg);
  }
`

export {
  CardWrapper,
  CardInfoWrapper,
  CardTitle,
  CardValuesWrapper,
  CurrentValueWrapper,
  TotalValueWrapper,
  StyledProgress as Progress,
}
