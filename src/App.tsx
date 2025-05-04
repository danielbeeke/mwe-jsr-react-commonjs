
import Compactor from '@danielbeeke/mwe-jsr-react-commonjs'

function App() {

  return (
    <>
  <Compactor iri='http://example.com/john' prefixes={{ ex: 'http://example.com/' }} />
    </>
  )
}

export default App
