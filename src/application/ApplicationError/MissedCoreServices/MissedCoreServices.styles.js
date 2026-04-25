
import styled from 'styled-components'
import background from '@/assets/images/deps_welcome.png'

export const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
`

export const Wrapper = styled.div`
  height: 100%;
  padding: 4rem;
  position: relative;
  background-image: linear-gradient(137.07deg, #5f92f0 -42.92%, rgba(255,255,255,0) 30.22%);
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: skew(15deg, 0deg);
    background-color: ${(props) => props.theme.color.primary5};
  }
`

export const Image = styled.div`
  width: 61rem;
  z-index: 1;
  margin-top: 5rem;
  background-image: url(${background});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
`

export const Text = styled.span`
  margin-bottom: 3rem;
  text-align: center;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 35%;
  margin-right: 5%;
  margin-bottom: 10%;
  z-index: 1;
  font-size: 1.6rem;
`

export const StyledList = styled.ol`
  text-align: left;
`
