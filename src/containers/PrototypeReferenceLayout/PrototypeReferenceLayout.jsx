
import PropTypes from 'prop-types'
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePolling } from 'use-raf-polling'
import {
  clearKeyToAssign,
  setActiveLayoutId,
  setActiveTable,
} from '@/actions/prototypePage'
import {
  useCreatePrototypeLayoutMutation,
  useFetchPrototypeLayoutQuery,
  useFetchPrototypeLayoutsQuery,
  useRestartPrototypeLayoutMutation,
  useDeletePrototypeLayoutMutation,
} from '@/apiRTK/prototypesApi'
import { CreatePrototypeTableField } from '@/containers/CreatePrototypeTableField'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { ReferenceLayoutState } from '@/enums/ReferenceLayoutState'
import { useEventSource, KnownBusinessEvent } from '@/hooks/useEventSource'
import { Localization, localize } from '@/localization/i18n'
import { prototypeFieldShape } from '@/models/PrototypeField'
import { activeLayoutIdSelector } from '@/selectors/prototypePage'
import { ENV } from '@/utils/env'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { Wrapper } from './PrototypeReferenceLayout.styles'
import { ReferenceLayoutDocumentView } from './ReferenceLayoutDocumentView'
import { ReferenceLayoutFieldListView } from './ReferenceLayoutFieldListView'
import { ReferenceLayoutGuard } from './ReferenceLayoutGuard'
import { ReferenceLayoutHeader } from './ReferenceLayoutHeader'
import { ReferenceLayoutViewType } from './ReferenceLayoutViewType'

const POLLING_INTERVAL = 2_000
const IN_PROCESSING_STATES = [
  ReferenceLayoutState.NEW,
  ReferenceLayoutState.UNIFICATION,
  ReferenceLayoutState.PARSING,
]

const PrototypeReferenceLayout = ({
  fieldsViewType,
  isEditMode,
  prototypeId,
  prototypeFields,
  addField,
}) => {
  const [viewType, setViewType] = useState(ReferenceLayoutViewType.DOCUMENT)

  const dispatch = useDispatch()

  const activeLayoutId = useSelector(activeLayoutIdSelector)
  const addEvent = useEventSource('DocumentData')

  const [
    createPrototypeLayout,
    { isLoading: isPrototypeLayoutCreating },
  ] = useCreatePrototypeLayoutMutation()

  const [
    restartPrototypeLayout,
    { isLoading: isPrototypeLayoutRestarting },
  ] = useRestartPrototypeLayoutMutation()

  const [
    deletePrototypeLayout,
    { isLoading: isPrototypeLayoutDeleting },
  ] = useDeletePrototypeLayoutMutation()

  const {
    data: prototypeLayouts = [],
    isFetching: isPrototypeLayoutsFetching,
    isError: isPrototypeLayoutsFetchingError,
    refetch: refetchPrototypeLayouts,
  } = useFetchPrototypeLayoutsQuery(prototypeId, {
    refetchOnMountOrArgChange: true,
    skip: !prototypeId,
  })

  const {
    data: prototypeLayout,
    isFetching: isPrototypeLayoutFetching,
    isError: isPrototypeLayoutFetchingError,
    refetch: refetchPrototypeLayout,
  } = useFetchPrototypeLayoutQuery(
    {
      prototypeId,
      layoutId: activeLayoutId,
    },
    {
      skip: !activeLayoutId,
      refetchOnMountOrArgChange: true,
    },
  )

  const onLayoutStateChanged = useCallback(async (eventData) => {
    if (eventData.prototypeId !== prototypeId) {
      return
    }

    if (IN_PROCESSING_STATES.includes(prototypeLayout?.state) && eventData.referenceLayoutId === prototypeLayout?.id) {
      await refetchPrototypeLayout()
    }

    if (prototypeLayouts.some((l) => IN_PROCESSING_STATES.includes(l.state))) {
      await refetchPrototypeLayouts()
    }
  }, [
    prototypeId,
    prototypeLayout,
    prototypeLayouts,
    refetchPrototypeLayout,
    refetchPrototypeLayouts,
  ])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }

    addEvent(KnownBusinessEvent.REFERENCE_LAYOUT_STATE_UPDATE, onLayoutStateChanged)
  }, [addEvent, onLayoutStateChanged])

  usePolling({
    callback: refetchPrototypeLayout,
    interval: POLLING_INTERVAL,
    condition: !ENV.FEATURE_SERVER_SENT_EVENTS && IN_PROCESSING_STATES.includes(prototypeLayout?.state),
  })

  usePolling({
    callback: refetchPrototypeLayouts,
    interval: POLLING_INTERVAL,
    condition: !ENV.FEATURE_SERVER_SENT_EVENTS && prototypeLayouts.some((l) => IN_PROCESSING_STATES.includes(l.state)),
  })

  const isFetching = useMemo(() => (
    isPrototypeLayoutFetching ||
    isPrototypeLayoutCreating ||
    isPrototypeLayoutsFetching ||
    isPrototypeLayoutRestarting ||
    isPrototypeLayoutDeleting
  ), [
    isPrototypeLayoutFetching,
    isPrototypeLayoutCreating,
    isPrototypeLayoutsFetching,
    isPrototypeLayoutRestarting,
    isPrototypeLayoutDeleting,
  ])

  useEffect(() => {
    const [firstLayout] = prototypeLayouts

    if (firstLayout && !activeLayoutId && !isFetching) {
      dispatch(setActiveLayoutId(firstLayout.id))
    }
  }, [
    dispatch,
    activeLayoutId,
    prototypeLayouts,
    isFetching,
  ])

  useEffect(() => {
    if (
      isPrototypeLayoutsFetchingError ||
      isPrototypeLayoutFetchingError
    ) {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }, [
    isPrototypeLayoutsFetchingError,
    isPrototypeLayoutFetchingError,
  ])

  const addLayout = useCallback(async ([file]) => {
    try {
      const { id } = await createPrototypeLayout({
        prototypeId,
        file,
      }).unwrap()
      dispatch(setActiveLayoutId(id))
      notifySuccess(localize(Localization.SUCCESS_UPLOAD_STATUS))
    } catch {
      notifyWarning(localize(Localization.FAILURE_UPLOAD_STATUS))
    }
  }, [
    dispatch,
    prototypeId,
    createPrototypeLayout,
  ])

  const restartLayout = useCallback(async () => {
    try {
      await restartPrototypeLayout({
        prototypeId,
        layoutId: activeLayoutId,
      }).unwrap()
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR_MESSAGE))
    }
  }, [
    restartPrototypeLayout,
    prototypeId,
    activeLayoutId,
  ])

  const removeLayout = useCallback(async (layoutId) => {
    try {
      const prototypeLayoutToRemove = prototypeLayouts.find(({ id }) => id === layoutId)
      const restLayouts = prototypeLayouts.filter(({ id }) => id !== layoutId)

      await deletePrototypeLayout({
        prototypeId,
        layoutId,
        isLastLayout: !restLayouts.length,
      }).unwrap()
      dispatch(setActiveLayoutId(null))

      notifySuccess(localize(
        Localization.REFERENCE_LAYOUT_DELETE_SUCCESS,
        { name: prototypeLayoutToRemove.title },
      ))
    } catch {
      notifyWarning(localize(Localization.REFERENCE_LAYOUT_DELETE_FAILED))
    }
  }, [
    dispatch,
    prototypeLayouts,
    prototypeId,
    deletePrototypeLayout,
  ])

  const prototypeMappingKeys = useMemo(() => (
    prototypeFields.flatMap((field) => field.mapping.keys)
  ), [prototypeFields])

  const handleViewChange = (type) => {
    dispatch(clearKeyToAssign())
    dispatch(setActiveTable(null))
    setViewType(type)
  }

  return (
    <Wrapper>
      <ReferenceLayoutHeader
        addLayout={addLayout}
        isEditMode={isEditMode}
        layout={prototypeLayout}
        layoutsList={prototypeLayouts}
        onViewChange={handleViewChange}
        removeLayout={removeLayout}
        viewType={viewType}
      />
      <ReferenceLayoutGuard
        addLayout={addLayout}
        isFetching={isFetching}
        prototypeId={prototypeId}
        referenceLayout={prototypeLayout}
        restartLayout={restartLayout}
      >
        {
          viewType === ReferenceLayoutViewType.DOCUMENT
            ? (
              <ReferenceLayoutDocumentView
                fieldsViewType={fieldsViewType}
                isEditMode={isEditMode}
                prototypeMappingKeys={prototypeMappingKeys}
                referenceLayout={prototypeLayout}
              />
            )
            : (
              <ReferenceLayoutFieldListView
                fieldsViewType={fieldsViewType}
                isEditMode={isEditMode}
                prototypeMappingKeys={prototypeMappingKeys}
              />
            )
        }
        <CreatePrototypeTableField
          addField={addField}
        />
      </ReferenceLayoutGuard>
    </Wrapper>
  )
}

PrototypeReferenceLayout.propTypes = {
  fieldsViewType: PropTypes.oneOf(
    Object.values(PrototypeViewType),
  ).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  prototypeId: PropTypes.string,
  prototypeFields: PropTypes.arrayOf(
    prototypeFieldShape.isRequired,
  ).isRequired,
  addField: PropTypes.func.isRequired,
}

export {
  PrototypeReferenceLayout,
}
