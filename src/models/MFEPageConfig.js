
class MFEPageConfig {
  constructor ({
    component,
    icon,
    path,
    exact,
    pageFallback,
    title,
  } = {}) {
    this.component = component
    this.exact = exact
    this.icon = icon
    this.path = path
    this.pageFallback = pageFallback
    this.title = title
  }
}

export {
  MFEPageConfig,
}
