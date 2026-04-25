
import styled, { css } from 'styled-components'
import { AngleDownIcon } from '@/components/Icons/AngleDownIcon'
import { Menu } from '@/components/Menu'
import { theme } from '@/theme/theme.default'

const ArrowIcon = styled(AngleDownIcon)`
  display: block;
  margin-left: 1rem;
`

const MenuItem = styled(Menu.Item)`
  ${(props) => props.$selected && css`
    background-color: ${theme.color.primary3};
    color: ${theme.color.primary4};
    border-left: 0.3rem solid ${theme.color.primary2};
    font-weight: 600;
    padding: 0.5rem 0.9rem;
  `}
`

export {
  ArrowIcon,
  MenuItem,
}
