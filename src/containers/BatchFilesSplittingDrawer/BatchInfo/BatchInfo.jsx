
import { useMemo } from 'react'
import { CircleExclamationIcon } from '@/components/Icons/CircleExclamationIcon'
import { Popover, PopoverTrigger } from '@/components/Popover'
import { Localization, localize } from '@/localization/i18n'
import { useFilesSplitting } from '../hooks'
import { getTooltipConfig } from '../utils'
import {
  IconButton,
  Label,
  StyledList,
  StyledItem,
} from './BatchInfo.styles'
import {
  BATCH_SETTINGS_TO_CONTENT,
  BATCH_SETTINGS_TO_LABEL,
  BatchSettings,
} from './constants'

export const BatchInfo = () => {
  const { batchSettings } = useFilesSplitting()

  const Content = useMemo(() => (
    <StyledList>
      {
        Object.values(BatchSettings).map((setting) => (
          <StyledItem key={setting}>
            <Label>
              {BATCH_SETTINGS_TO_LABEL[setting]}
            </Label>
            {BATCH_SETTINGS_TO_CONTENT[setting](batchSettings[setting]) || '-'}
          </StyledItem>
        ))
      }
    </StyledList>
  ), [batchSettings])

  return (
    <Popover
      content={Content}
      trigger={PopoverTrigger.CLICK}
    >
      <IconButton
        icon={<CircleExclamationIcon />}
        tooltip={getTooltipConfig(localize(Localization.BATCH_SETTINGS))}
      />
    </Popover>
  )
}
