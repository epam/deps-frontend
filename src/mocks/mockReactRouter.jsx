
const Route = () => <div className='mock-react-router-route' />

Route.propTypes = {}

const Router = () => <div className='mock-react-router-router' />

const Consumer = () => <div className='mock-react-router-consumer' />

const Switch = () => <div className='mock-react-router-switch' />

const Redirect = () => <div className='mock-react-router-redirect' />

const useParams = jest.fn(() => ({}))

const useRouteMatch = jest.fn()

const mockReactRouter = {
  Route,
  Router,
  Switch,
  Redirect,
  useParams,
  __RouterContext: {
    Consumer,
  },
  withRouter: (ConnectedComponent) => ({
    ConnectedComponent,
  }),
  useRouteMatch,
}

export {
  mockReactRouter,
}
