
const mockButton = () => ({
  Button: (() => {
    function Button (props) {
      return <button {...props} />
    }
    Button.Text = function ButtonText (props) {
      return <button {...props} />
    }
    Button.Icon = function ButtonIcon (props) {
      return <button {...props} />
    }
    Button.Link = function ButtonLink (props) {
      return <button {...props} />
    }
    return Button
  })(),
})

export {
  mockButton,
}
