
import styled from 'styled-components'
import { Modal } from '@/components/Modal'
import { Progress } from '@/components/Progress'

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    box-shadow: 0 0.3rem 1.9rem 0 ${(props) => props.theme.color.shadow3};
  }

  .ant-modal-body {
    padding: 0 1.6rem 1.6rem;
  }

  .ant-modal-header {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
  }
  
  .ant-modal-title {
    padding: 1px 0;
    color: ${(props) => props.theme.color.grayscale18};
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 2.2rem;
  }
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const NotificationTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;  
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale18};
`

export const NotificationMessage = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  color: ${(props) => props.theme.color.grayscale12};
  text-align: center;
  margin-bottom: 1.6rem;
`

export const StyledProgress = styled(Progress)`
  padding: 0.8rem 1.2rem;
  background-color: ${(props) => props.theme.color.grayscale20};
  border-radius: 16px;
  line-height: 1;
`

export const CountersWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`

export const Counter = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale18};
`

export const IconWrapper = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  margin: 0 auto 3rem;
  font-size: 3.2rem;
  line-height: 0.85;
  color: ${(props) => props.theme.color.grayscale12};
  animation: rotating 1.5s linear infinite;

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
