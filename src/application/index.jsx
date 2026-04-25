
import 'antd/lib/style/themes/default.less'
import 'antd/lib/style/core/index.less'
import ReactDOM from 'react-dom'
import { Authentication } from '@/application/Authentication'
import { DefaultGlobalStyles } from '@/application/DefaultGlobalStyles'
import { Provider } from '@/application/Provider'
import { initializeElasticAPM } from '@/utils/elasticApm'

initializeElasticAPM()
const root = document.createElement('div')
root.classList.add('root')

ReactDOM.render(
  (
    <Provider>
      <DefaultGlobalStyles />
      <Authentication />
    </Provider>
  ),
  document.body.appendChild(root),
)
