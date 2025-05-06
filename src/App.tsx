import { ShaclRenderer } from '@shapething/shacl-renderer'

function App() {

  return (
    <ShaclRenderer
      mode="edit"
      shapes={new URL('/shapes/contact.ttl', location.origin)}
    />
  )
}

export default App
