
import PropTypes from 'prop-types'
import { useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { connect } from 'react-redux'
import { setScrollId } from '@/actions/navigation'
import { UiKeys } from '@/constants/navigation'
import { uiSelector } from '@/selectors/navigation'
import { StyledInView, Spinner } from './InView.styles'

const separator = '~'
const getSeparatedId = (code, index) => {
  return (index || index === 0) ? `${code}${separator}${index}` : `${code}`
}

const InView = ({
  children,
  id,
  scrollId,
  triggerOnce = true,
  setScrollId,
  className,
}) => {
  const { ref, inView } = useInView({
    triggerOnce,
  })

  const scrollTo = useCallback((id) => {
    const element = window.document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (scrollId && scrollId === id && !inView) {
      scrollTo(scrollId)
    }

    if (scrollId === id && inView) {
      scrollTo(scrollId)
      setScrollId('')
    }
  }, [id, inView, scrollId, scrollTo, setScrollId])

  return (
    <StyledInView
      ref={ref}
      className={className}
      id={id}
    >
      {
        inView
          ? children
          : <Spinner spinning />
      }
    </StyledInView>
  )
}

InView.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  scrollId: PropTypes.string,
  triggerOnce: PropTypes.bool,
  setScrollId: PropTypes.func.isRequired,
  className: PropTypes.string,
}

const mapStateToProps = (state) => ({
  scrollId: uiSelector(state)[UiKeys.SCROLL_ID],
})

const ContentContainer = connect(mapStateToProps, {
  setScrollId,
})(InView)

export {
  ContentContainer as InView,
  getSeparatedId,
}
