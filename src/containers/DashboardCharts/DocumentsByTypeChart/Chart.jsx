
import { ResponsiveBar } from '@nivo/bar'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import PropTypes from 'prop-types'
import { theme } from '@/theme/theme.default'
import { Wrapper } from './Chart.style'

const CHART_THEME = {
  background: 'transparent',
  text: {
    fontSize: 10,
    fill: theme.color.grayscale12,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  axis: {
    domain: {
      line: {
        stroke: theme.color.grayscale12,
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 10,
        fill: theme.color.grayscale12,
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
    ticks: {
      line: {
        stroke: theme.color.grayscale12,
        strokeWidth: 1,
      },
      text: {
        fontSize: 10,
        fill: theme.color.grayscale12,
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
  },
  grid: {
    line: {
      stroke: theme.color.grayscale12,
      strokeWidth: 1,
    },
  },
  tooltip: {
    base: {
      background: theme.color.primary3,
      borderRadius: '2px',
      padding: '5px 9px',
      boxShadow: `${theme.color.grayscale4} 0px 1px 2px`,
    },
  },
}

const keys = ['count']
const axisTextMaxLength = 10

const formatDocTypeName = (value) => value.length > axisTextMaxLength ? `${value.slice(0, axisTextMaxLength)}...` : value

const getDocTypeTickRenderer = (data) => (tick) => {
  const { value, x, y, lineX, lineY, textX, textY, textAnchor, textBaseline } = tick
  const type = data.find((item) => item.id === value)
  const lineStyle = CHART_THEME.axis.ticks.line
  const textStyle = CHART_THEME.axis.ticks.text
  return (
    <g
      dominantBaseline={textBaseline}
      transform={`translate(${x},${y})`}
    >
      <line
        style={lineStyle}
        x1={0}
        x2={lineX}
        y1={0}
        y2={lineY}
      />
      <text
        style={textStyle}
        textAnchor={textAnchor}
        transform={`translate(${textX}, ${textY})`}
      >
        {formatDocTypeName(type.documentType)}
      </text>
    </g>
  )
}

const getCountTicks = (minCount, maxCount) =>
  (minCount && maxCount)
    ? [minCount, maxCount]
    : []

const renderTooltip = ({ data }) => {
  return (
    <div style={CHART_THEME.tooltip.base}>
      <span>
        {`${data.documentType}: `}
        <strong>{`${data.count}`}</strong>
      </span>
    </div>
  )
}

const onBarMouseEnter = (_data, event) => {
  event.target.style.fill = theme.color.grayscale19
}

const onBarMouseLeave = (_data, event) => {
  event.target.style.fill = theme.color.grayscale22
}

const Chart = ({
  data = [],
  onClick,
}) => {
  const normalizedData = data.filter((item) => item.count > 0)
  const maxCount = maxBy(normalizedData, 'count')?.count
  const minCount = minBy(normalizedData, 'count')?.count

  return (
    <Wrapper>
      <ResponsiveBar
        animate={false}
        axisBottom={
          {
            tickSize: 6,
            tickPadding: 4,
            tickRotation: 0,
            renderTick: getDocTypeTickRenderer(data),
          }
        }
        axisLeft={
          {
            tickSize: 6,
            tickPadding: 5,
            tickRotation: 0,
            tickValues: getCountTicks(minCount, maxCount),
          }
        }
        borderRadius={5}
        colorBy={'indexValue'}
        colors={[theme.color.grayscale22]}
        data={data}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        indexBy="id"
        indexScale={
          {
            type: 'band',
            round: true,
          }
        }
        isInteractive={true}
        keys={keys}
        layers={
          [
            'grid',
            'axes',
            'bars',
            'legends',
            'annotations',
          ]
        }
        margin={
          {
            top: 15,
            right: 0,
            bottom: 32,
            left: 30,
          }
        }
        onClick={onClick}
        onMouseEnter={onBarMouseEnter}
        onMouseLeave={onBarMouseLeave}
        padding={0.6}
        theme={CHART_THEME}
        tooltip={renderTooltip}
        valueScale={{ type: 'symlog' }}
      />
    </Wrapper>
  )
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    documentType: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    code: PropTypes.string,
  })),
  onClick: PropTypes.func.isRequired,
}

export { Chart }
