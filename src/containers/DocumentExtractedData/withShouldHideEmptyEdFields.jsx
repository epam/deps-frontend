
import { useCustomModule } from '@/hooks/useCustomModule'

const MODULE_NAME = 'ShouldHideEmptyEdFields'

const withShouldHideEmptyEdFields = (Component) => {
  const Wrapper = (props) => {
    const { module } = useCustomModule(MODULE_NAME)
    return (
      <Component
        {...{
          ...props,
          [MODULE_NAME]: module,
        }}
      />
    )
  }

  return Wrapper
}

export { withShouldHideEmptyEdFields }
