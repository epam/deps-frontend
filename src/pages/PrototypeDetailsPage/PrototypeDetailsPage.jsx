
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { setActiveLayoutId } from '@/actions/prototypePage'
import { useFetchPrototypeQuery } from '@/apiRTK/prototypesApi'
import { Content } from '@/components/Layout'
import { NoData } from '@/components/NoData'
import { Spin } from '@/components/Spin'
import { PrototypeData } from '@/containers/PrototypeData'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'
import { PrototypeHeader } from './PrototypeHeader'
import { PrototypeInfo } from './PrototypeInfo'
import { usePrototypeEditMode } from './usePrototypeEditMode'

const PrototypeDetailsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const {
    data: fetchedPrototype,
    isFetching,
    error,
    refetch,
  } = useFetchPrototypeQuery(id, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    return () => {
      dispatch(setActiveLayoutId(null))
    }
  }, [dispatch])

  const {
    checkIfFieldIsSaved,
    editModePrototype,
    isSaving,
    isEditMode,
    isPrototypeTouched,
    onSave,
    onCancel,
    toggleEditMode,
    onPrototypeFieldChange,
    onPrototypeInfoDataChange,
    addPrototypeField,
    removePrototypeField,
    fieldsViewType,
    setFieldsViewType,
  } = usePrototypeEditMode(fetchedPrototype)

  const saveData = async () => {
    try {
      await onSave()
      await refetch()
      toggleEditMode()
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.PROTOTYPE_SAVING_ERROR)
      notifyWarning(message)
    }
  }

  if (isFetching || isSaving) {
    return <Spin.Centered spinning />
  }

  if (error?.status === StatusCode.NOT_FOUND) {
    goTo(navigationMap.error.notFound())
    return null
  }

  if (error) {
    notifyWarning(localize(Localization.DEFAULT_ERROR))
    return <NoData />
  }

  const prototypeToDisplay = isEditMode ? editModePrototype : fetchedPrototype

  return (
    <Content>
      <PrototypeHeader
        isEditMode={isEditMode}
        isSavingDisabled={!isPrototypeTouched}
        onCancel={onCancel}
        onEdit={toggleEditMode}
        onSave={saveData}
        prototypeId={prototypeToDisplay.id}
        prototypeName={prototypeToDisplay.name}
      />
      <PrototypeInfo
        fieldsViewType={fieldsViewType}
        isEditMode={isEditMode}
        onValueChange={onPrototypeInfoDataChange}
        prototype={prototypeToDisplay}
        setFieldsViewType={setFieldsViewType}
      />
      <PrototypeData
        addField={addPrototypeField}
        checkIfFieldIsSaved={checkIfFieldIsSaved}
        fieldsViewType={fieldsViewType}
        isEditMode={isEditMode}
        prototypeId={id}
        regularFields={prototypeToDisplay.fields}
        removeField={removePrototypeField}
        tableFields={prototypeToDisplay.tableFields}
        toggleEditMode={toggleEditMode}
        updateField={onPrototypeFieldChange}
      />
    </Content>
  )
}

export {
  PrototypeDetailsPage,
}
