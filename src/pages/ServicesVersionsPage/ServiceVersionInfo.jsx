
import PropTypes from 'prop-types'
import {
  ServiceVersionInfoWrapper,
  ServiceVersionInfoHeader,
  ServiceVersionInfoContent,
} from './ServiceVersionInfo.styles'

const ServiceVersionInfo = ({ serviceName, serviceInfo }) => (
  <ServiceVersionInfoWrapper>
    <ServiceVersionInfoHeader>
      {serviceName}
    </ServiceVersionInfoHeader>
    {
      serviceInfo && Object.entries(serviceInfo).map(([serviceInfoName, serviceInfoValue], index) => (
        <ServiceVersionInfoContent key={`${serviceInfoName}${index}`}>
          {`${serviceInfoName}: ${serviceInfoValue}`}
        </ServiceVersionInfoContent>
      ))
    }
  </ServiceVersionInfoWrapper>
)

ServiceVersionInfo.propTypes = {
  serviceInfo: PropTypes.shape({
    [PropTypes.string]: PropTypes.string,
  }),
  serviceName: PropTypes.string.isRequired,
}

export {
  ServiceVersionInfo,
}
