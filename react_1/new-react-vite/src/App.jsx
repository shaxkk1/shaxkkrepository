import { useState } from 'react'
import Header from './components/Header'
import VeteranList from './components/VeteranList'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [showLogo, setShowLogo] = useState(true)

  return (
    <div className="app-container">
      <Header 
        title="Veterans Memorial Database" 
        subtitle="Honoring Those Who Served" 
      />
      
      <div className="logo-section">
        {showLogo && (
          <img 
            src={reactLogo} 
            className="react-logo" 
            alt="React logo" 
          />
        )}
        <button onClick={() => setShowLogo(!showLogo)}>
          {showLogo ? 'Hide' : 'Show'} Logo
        </button>
      </div>

      <VeteranList />
    </div>
  )
}

export default App
