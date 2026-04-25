
import { DashboardCards } from '@/containers/DashboardCards'
import { DashboardCharts } from '@/containers/DashboardCharts'
import { Localization, localize } from '@/localization/i18n'
import { Title, Content } from './DashboardPage.styles'

const DashboardPage = () => (
  <Content>
    <Title>
      {localize(Localization.DASHBOARD)}
    </Title>
    <DashboardCards />
    <DashboardCharts />
  </Content>
)

export {
  DashboardPage,
}
