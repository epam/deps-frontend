
import React, { useState, useCallback } from 'react'
import { Tab } from '@/components/Tabs'
import { FrequentlyAskedQuestions } from '@/containers/FrequentlyAskedQuestions'
import { Localization, localize } from '@/localization/i18n'
import { HelpWrapper, Tabs } from './HelpPage.styles'

const HELP_PAGE_TABS = {
  FREQUENTLY_ASKED_QUESTIONS: 'FREQUENTLY_ASKED_QUESTIONS',
}

const HELP_PAGE_TABS_TO_TAB_NAME = {
  [HELP_PAGE_TABS.FREQUENTLY_ASKED_QUESTIONS]: localize(Localization.FREQUENTLY_ASKED_QUESTIONS),
}

const HELP_PAGE_TABS_TO_RENDER = {
  [HELP_PAGE_TABS.FREQUENTLY_ASKED_QUESTIONS]: <FrequentlyAskedQuestions />,
}

const HelpPage = () => {
  const [activeKey, setActiveKey] = useState(HELP_PAGE_TABS.FREQUENTLY_ASKED_QUESTIONS)

  const renderHelpPageTabs = () => (
    Object.keys(HELP_PAGE_TABS).map((el) => (
      new Tab(
        el,
        HELP_PAGE_TABS_TO_TAB_NAME[el],
        HELP_PAGE_TABS_TO_RENDER[el],
      )
    ))
  )

  const onChangeActiveKey = useCallback(
    (key) => setActiveKey(key),
    [setActiveKey],
  )

  return (
    <HelpWrapper>
      <Tabs
        activeKey={activeKey}
        animated={false}
        onChange={onChangeActiveKey}
        tabs={renderHelpPageTabs()}
      />
    </HelpWrapper>
  )
}

export {
  HelpPage,
}
