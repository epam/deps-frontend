
import {
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react'
import { useSelector } from 'react-redux'
import { fetchDocumentOutputs } from '@/api/outputProfilesApi'
import { Button } from '@/components/Button'
import { Spin } from '@/components/Spin'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import { theme } from '@/theme/theme.default'
import { notifyWarning } from '@/utils/notification'
import {
  DrawerHeaderWrapper,
  Drawer,
  NoData,
} from './DocumentOutputArchiveButton.styles'
import { OutputCard } from './OutputCard'

const DocumentOutputArchiveButton = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false)
  const [outputs, setOutputs] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const activeDocument = useSelector(documentSelector)
  const documentType = useSelector(documentTypeSelector)

  const getContainer = useCallback(() => document.body, [])

  const toggleDrawerVisibility = () => setDrawerVisible((prev) => !prev)

  const getData = useCallback(async () => {
    try {
      setIsLoading(true)
      const { outputs } = await fetchDocumentOutputs(activeDocument._id)
      setOutputs(outputs)
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsLoading(false)
    }
  }, [activeDocument?._id])

  useEffect(() => {
    isDrawerVisible && getData()
  }, [getData, isDrawerVisible])

  const DrawerContent = useMemo(() => {
    if (isLoading) {
      return
    }

    if (!outputs?.length) {
      return (
        <NoData />
      )
    }

    return outputs.map((output) => {
      const profile = documentType?.profiles.find((profile) => output.profileInfo.id === profile.id)

      return (
        <OutputCard
          key={output.id}
          documentId={activeDocument?._id}
          documentTitle={activeDocument?.title}
          documentTypeId={documentType?.code}
          output={output}
          profile={profile}
          reloadData={getData}
        />
      )
    })
  }, [
    activeDocument?._id,
    activeDocument?.title,
    documentType?.code,
    documentType?.profiles,
    isLoading,
    getData,
    outputs,
  ])

  const DrawerTitle = useMemo(() => (
    <DrawerHeaderWrapper>
      {localize(Localization.GENERATED_OUTPUTS)}
    </DrawerHeaderWrapper>
  ), [])

  return (
    <>
      <Button.Text onClick={toggleDrawerVisibility}>
        {localize(Localization.OUTPUT_ARCHIVE)}
      </Button.Text>
      <Drawer
        closeIcon={false}
        getContainer={getContainer}
        onClose={toggleDrawerVisibility}
        open={isDrawerVisible}
        placement={Placement.RIGHT}
        title={DrawerTitle}
        width={theme.size.drawerWidth}
      >
        <Spin spinning={isLoading}>
          {DrawerContent}
        </Spin>
      </Drawer>
    </>
  )
}

export {
  DocumentOutputArchiveButton,
}
