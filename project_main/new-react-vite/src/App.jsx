import { useState } from 'react'
import Header from './components/Header'
import Counter from './components/Counter'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [showImage, setShowImage] = useState(true)

  return (
    <div className="app-container">
      <Header 
        title="React Components Demo" 
        subtitle="A demonstration of React components, props, and hooks" 
      />
      
      <div className="logo-section">
        {showImage && (
          <img 
            src={reactLogo} 
            className="react-logo" 
            alt="React logo" 
          />
        )}
        <button onClick={() => setShowImage(!showImage)}>
          {showImage ? 'Hide' : 'Show'} Logo
        </button>
      </div>

      <Counter initialCount={0} />
    </div>
  )
}

export default App
