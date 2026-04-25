
// Fix for styled-components v5 + React types compatibility
// Issue: styled-components returns ReactElement with Key (string | number)
// but JSX.Element expects key to be string | null

declare global {
  namespace JSX {
    interface Element {
      key: string | number | null
    }
  }
}

export {}
