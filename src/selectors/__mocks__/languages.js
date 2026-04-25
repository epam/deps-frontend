
import { mockSelector } from '@/mocks/mockSelector'
import { Language } from '@/models/Language'

const languagesSelector = mockSelector([
  new Language('eng', 'English'),
  new Language('rus', 'Russian'),
  new Language('chi_sim', 'Simplified Chinese'),
  new Language('deu', 'Deutsch'),
  new Language('spa', 'Spanish'),
  new Language('ukr', 'Ukrainian'),
])

export {
  languagesSelector,
}
