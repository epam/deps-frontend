/* eslint-disable react/prop-types */

const mockComponent = (componentName, namedExport = true, fn = () => componentName) => {
  Object.defineProperty(fn, 'name', { value: componentName })
  return !namedExport ? fn : { [componentName]: fn }
}

const mockShallowComponent = (componentName, shouldDive = true, namedExport = true) => {
  const propTransformations = {
    boolean: (value) => value.toString(),
    function: (value, key) => `mock-${key}`,
    object: (value) => JSON.stringify(value),
  }

  let props

  const MockTemplateComponent = ({ children, ...restProps }) => {
    props = restProps

    const safeStringProps = Object.entries(restProps).reduce((acc, [key, value]) => {
      const valueType = typeof value
      acc[`data-${key.toLowerCase()}`] = propTransformations[valueType]?.(value, key) ?? `${value}`
      return acc
    }, {})

    return (
      <template
        data-testid={componentName}
        {...safeStringProps}
      >
        {shouldDive && children}
      </template>
    )
  }

  const jestFn = jest.fn(MockTemplateComponent)

  jestFn.getProps = () => props

  if (!namedExport) {
    return jestFn
  }

  return { [componentName]: jestFn }
}

export {
  mockComponent,
  mockShallowComponent,
}
