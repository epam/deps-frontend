
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const TEST_ID = {
  INFINITE_SCROLL: 'infinite-scroll',
}

const InfiniteScroll = ({
  loadMore,
  className,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
  })

  useEffect(() => {
    if (!inView) {
      return
    }

    loadMore()
  }, [inView, loadMore])

  return (
    <div
      ref={ref}
      className={className}
      data-testid={TEST_ID.INFINITE_SCROLL}
    />
  )
}

InfiniteScroll.propTypes = {
  loadMore: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export {
  InfiniteScroll,
}
