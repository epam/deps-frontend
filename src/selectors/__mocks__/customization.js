
import { mockSelector } from '@/mocks/mockSelector'

const customizationSelector = mockSelector({
  Field: {
    getUrl: () => './mockUrl',
  },
  UserFeedback: {
    getUrl: () => './mockUrl',
  },
  GlobalStyles: {
    getUrl: () => 'mockUrl',
  },
  ApplicationFooter: {
    getUrl: () => 'mockUrl',
  },
  GlobalMenu: {
    getUrl: () => 'mockUrl',
  },
  UserGuideDownloadButton: {
    getUrl: () => 'mockUrl',
  },
  FieldLabel: {
    getUrl: () => 'mockUrl',
  },
  DownloadDropdownButton: {
    getUrl: () => 'mockUrl',
  },
  StartTourButton: {
    getUrl: () => 'mockUrl',
  },
})

export {
  customizationSelector,
}
