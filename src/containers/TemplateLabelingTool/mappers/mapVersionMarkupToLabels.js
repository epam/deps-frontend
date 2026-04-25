
import { Label } from 'labeling-tool/lib/models/Label'
import { PageMarkup, Markup } from 'labeling-tool/lib/models/Markup'
import isEmpty from 'lodash/isEmpty'

const mapVersionMarkupToLabels = (versionPages) => {
  if (!versionPages || isEmpty(versionPages)) {
    return null
  }

  return versionPages.reduce((ltMarkup, versionPage, index) => {
    const labels = []
    versionPage.markups.forEach((vpMarkup) => {
      vpMarkup.coordinates.forEach((coords) => {
        labels.push(new Label(
          coords.x,
          coords.y,
          coords.w,
          coords.h,
          vpMarkup.code,
          undefined,
          vpMarkup.type,
        ))
      })
    })

    const pageMarkup = new PageMarkup(labels)
    const ltChunkMarkup = new Markup(
      new Map(
        [
          [
            index + 1,
            pageMarkup,
          ],
        ],
      ),
    )

    return Markup.merge(ltMarkup, ltChunkMarkup)
  }, {})
}

export { mapVersionMarkupToLabels }
