
import { mockSelector } from '@/mocks/mockSelector'
import { Organisation } from '@/models/Organisation'

const organisationsSelector = mockSelector(
  [new Organisation('1111', 'System', 'https://host/customisation.js')],
)

export {
  organisationsSelector,
}
