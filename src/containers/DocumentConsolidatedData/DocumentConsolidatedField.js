
class DocumentConsolidatedField {
  constructor ({
    code,
    name,
    order,
    type,
    baseType,
    render,
  }) {
    this.name = name
    this.code = code
    this.order = order
    this.render = render
    this.type = type
    this.baseType = baseType
  }
}

export {
  DocumentConsolidatedField,
}
