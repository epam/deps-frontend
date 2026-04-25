
import { history } from '@/utils/history'

export function goBack () {
  history.goBack()
}

export function goTo (link, state) {
  history.push(link, state)
}
