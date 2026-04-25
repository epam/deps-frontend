
import PropTypes from 'prop-types'
import { Spin } from '@/components/Spin'
import { EmptyReferenceLayout } from '@/containers/PrototypeReferenceLayout/EmptyReferenceLayout'
import { FailedReferenceLayout } from '@/containers/PrototypeReferenceLayout/FailedReferenceLayout'
import { ProcessingReferenceLayout } from '@/containers/PrototypeReferenceLayout/ProcessingReferenceLayout'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { referenceLayoutShape } from '@/models/ReferenceLayout'
import { childrenShape } from '@/utils/propTypes'

const ReferenceLayoutGuard = ({
  addLayout,
  restartLayout,
  isFetching,
  referenceLayout,
  prototypeId,
  children,
}) => {
  if (isFetching && !referenceLayout) {
    return <Spin.Centered spinning />
  }

  if (!referenceLayout) {
    return (
      <EmptyReferenceLayout
        addLayout={addLayout}
        isUploadAvailable={!!prototypeId}
      />
    )
  }

  if (referenceLayout.state === ReferenceLayoutState.FAILED) {
    return (
      <FailedReferenceLayout
        restartLayout={restartLayout}
      />
    )
  }

  if (referenceLayout.state !== ReferenceLayoutState.READY) {
    return (
      <ProcessingReferenceLayout />
    )
  }

  return children
}

ReferenceLayoutGuard.propTypes = {
  addLayout: PropTypes.func.isRequired,
  restartLayout: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  referenceLayout: referenceLayoutShape,
  prototypeId: PropTypes.string,
  children: childrenShape.isRequired,
}

export {
  ReferenceLayoutGuard,
}
