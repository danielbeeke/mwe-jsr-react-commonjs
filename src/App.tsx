import { ShaclRenderer } from '@shapething/shacl-renderer'
import '../node_modules/@shapething/shacl-renderer/lib/style.css'

function App() {

  return (
    <ShaclRenderer
      mode="edit"
      shapes={new URL('/contact.ttl', location.origin)}
    />
  )
}

export default App
