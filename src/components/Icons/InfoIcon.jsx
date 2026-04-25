
import { AiFillInfoCircle } from 'react-icons/ai'
import Info from '@/assets/icons/ic-32-info.svg'
import { Icon } from './Icons.styles'

const InfoIcon = () => (
  <Icon>
    <Info />
  </Icon>
)

InfoIcon.Filled = (props) => (
  <AiFillInfoCircle {...props} />
)

export {
  InfoIcon,
}
