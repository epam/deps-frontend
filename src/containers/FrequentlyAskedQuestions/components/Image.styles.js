
import styled from 'styled-components'
import { ScreenBreakpoint } from '@/enums/ScreenBreakpoint'

const sideImageSize = `
  height: 40rem;
  @media (max-width: ${ScreenBreakpoint.laptop}) {
    height: 30rem;
  }
`

const StyledImage = styled.div`
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

const LargeImage = styled(StyledImage)`
  width: 80rem;
  height: 25rem;
  margin: 2rem auto;
`

const ExtraLargeImage = styled(StyledImage)`
  width: 100%;
  max-width: 80rem;
  height: 40rem;
  margin: 2rem auto;
`

const LargeSideImage = styled(StyledImage)`
  width: 75%;
  ${sideImageSize}
`

const SmallSideImage = styled(StyledImage)`
  width: 25%;
  ${sideImageSize}
`

const ImageWithoutText = styled(StyledImage)`
  height: 25rem;
`

const CenteredImage = styled(StyledImage)`
  align-self: center;
`

export {
  StyledImage,
  LargeImage,
  ExtraLargeImage,
  ImageWithoutText,
  CenteredImage,
  SmallSideImage,
  LargeSideImage,
}
