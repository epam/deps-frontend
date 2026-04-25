
import styled from 'styled-components'
import textBackground from '@/assets/icons/wave.svg'

const Status = styled.div`
  position: relative;
  z-index: 1;
  font-weight: 800;
  font-size: 22.3rem;
  line-height: 22.3rem;
  background: ${(props) => props.theme.color.primary1};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const InfoText = styled.div`
  font-size: 1.8rem;
  line-height: 3.2rem;
  color: rgba(48, 48, 48, 0.55);
  margin-bottom: 3.3rem;
`

const Heading = styled.div`
  width: 66.5rem;
  height: 11rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 4.8rem;
  background: url(${textBackground});
  margin-bottom: 1rem;
`

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.color.primary3};
`

export {
  Status,
  InfoText,
  Heading,
  Wrapper,
}
