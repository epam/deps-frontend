
import styled from 'styled-components'
import { Input } from '@/components/Input'
import { LongText } from '@/components/LongText'

const ImageFieldWrapper = styled.div`
  width: ${(props) => (props.$isExpanded ? '100%' : '18rem')};
  height: ${(props) => (props.$isExpanded ? 'auto' : '13.9rem')};
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  border: 0.1rem solid ${(props) => props.theme.color.grayscale1};
  border-radius: 0.8rem;
  overflow: hidden;
  cursor: pointer;
`

const LongTitle = styled(LongText)`
  padding: 0.8rem 1.2rem;
`

const TitleInput = styled(Input)`
  background-color: ${(props) => props.theme.color.grayscale14};
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem;
  font-weight: 600;
  height: 3.8rem;
  width: 100%;
  border: none;
  outline: none;
  box-shadow: none;
  display: flex;
  align-items: center;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${(props) => (props.$isExpanded ? 'initial' : '10.1rem')};
  padding-bottom: 56.25%;
  overflow: hidden;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  z-index: 0.1;
`

const ImageBackground = styled.div`
  position: absolute;
  background: linear-gradient(
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.3)
  ), url(${(props) => props.backgroundImage}) no-repeat center center;
  width: 100%;
  height: 100%;
  background-size: cover;
  filter: blur(0.5rem);
  z-index: 0;
`

const DescriptionText = styled.div`
  padding: 0.8rem 1.2rem;
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.3rem;
`

const DescriptionTextArea = styled(Input.TextArea)`
  background-color: ${(props) => props.theme.color.grayscale14};
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.3rem;
  font-weight: 400;
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: none;
  outline: none;
  box-shadow: none;
  resize: none;
  display: flex;
  align-items: center;
`

export {
  ImageFieldWrapper,
  Image,
  TitleInput,
  LongTitle,
  ImageWrapper,
  ImageBackground,
  DescriptionTextArea,
  DescriptionText,
}
