
import styled from 'styled-components'
import { ProfileStatus } from '../enums/ProfileStatus'

const Card = styled.div`
  margin-bottom: 1.6rem;
  border: 1px solid ${({ theme, profileStatus }) => {
    if (profileStatus === ProfileStatus.DELETED) {
    return theme.color.error
    }

    if (profileStatus === ProfileStatus.OUTDATED) {
    return theme.color.warning
    }

    return theme.color.primary2Light
    }};
  border-radius: 0.8rem;
  cursor: pointer;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.3rem 1.6rem;
  font-weight: 600;
  font-size: 1.6rem;
  color: ${(props) => props.theme.color.grayscale13};
  border-bottom: 1px solid ${(props) => props.theme.color.primary2Light};
  background-color: ${(props) => props.theme.color.primary3};

  & button {
    border: 1px solid ${(props) => props.theme.color.primary2};
  }
`

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-width: 65%;
  font-size: 1.4rem;
`

const Content = styled.div`
  position: relative;
  background: ${(props) => props.theme.color.grayscale14};
  padding: 1.6rem;
  height: 100%;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const InfoColl = styled.div`
  display: flex;
  justify-content: space-between;
  text-transform: capitalize;
`

const HeaderCreatedInfo = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.color.grayscale16};
`

const DateText = styled.span`
  font-weight: 700;
`

const ValidationSwitch = styled.div`
  display: flex;
`

const Label = styled.label`
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale12};
  margin-right: 1.2rem;
`

export {
  Card,
  Content,
  Header,
  InfoColl,
  InfoRow,
  HeaderTitle,
  HeaderCreatedInfo,
  DateText,
  ValidationSwitch,
  Label,
}
