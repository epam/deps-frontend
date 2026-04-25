
import { LabelingTool as LT } from 'labeling-tool'
import { Feature } from 'labeling-tool/lib/enums/Feature'
import { Mode } from 'labeling-tool/lib/enums/Mode'
import { Panel } from 'labeling-tool/lib/enums/Panel'
import { Tool } from 'labeling-tool/lib/enums/Tool'
import { labelShape } from 'labeling-tool/lib/models/Label'
import { subSettingsShape } from 'labeling-tool/lib/models/SubSettings'
import { tableShape } from 'labeling-tool/lib/models/Table'
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { KnownLanguage } from '@/enums/KnownLanguage'
import { engineShape } from '@/models/Engine'
import { languageShape } from '@/models/Language'

class LabelingTool extends PureComponent {
  static propTypes = {
    config: PropTypes.shape({
      document: PropTypes.shape({
        pages: PropTypes.arrayOf(PropTypes.string).isRequired,
        language: PropTypes.oneOf(Object.values(KnownLanguage)),
      }).isRequired,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          code: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          singleValue: PropTypes.bool,
          required: PropTypes.bool.isRequired,
        }),
      ).isRequired,
      ocr: PropTypes.shape({
        engines: PropTypes.arrayOf(engineShape),
        languages: PropTypes.arrayOf(languageShape),
      }),
      api: PropTypes.shape({
        close: PropTypes.func.isRequired,
        notify: PropTypes.shape({
          error: PropTypes.func,
          info: PropTypes.func,
          success: PropTypes.func,
          warning: PropTypes.func,
        }),
        save: PropTypes.func,
        saveMarkup: PropTypes.func.isRequired,
        recognize: PropTypes.func,
      }).isRequired,
      addFieldForm: PropTypes.func,
      markup: PropTypes.shape({
        labels: PropTypes.arrayOf(labelShape),
        tables: PropTypes.arrayOf(tableShape),
      }),
      settings: PropTypes.shape({
        mode: PropTypes.oneOf(
          Object.values(Mode),
        ),
        panels: PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.oneOf(
              Object.values(Panel),
            ),
            subSettingsShape,
          ]),
        ),
        tools: PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.oneOf(
              Object.values(Tool),
            ),
            subSettingsShape,
          ]),
        ),
        features: PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.oneOf(
              Object.values(Feature),
            ),
            subSettingsShape,
          ]),
        ),
      }),
    }).isRequired,
  }

  render = () => (
    <LT
      config={this.props.config}
    />
  )
}

export {
  LabelingTool,
  Mode,
  Panel,
  Tool,
  Feature,
}
