import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import VeteranList from './components/VeteranList';
import Header from './components/Header';

function App() {
  const [showLogo, setShowLogo] = useState(true);

  return (
    <div className="App">
      <Header 
        title="Bethel Cemetery Veteran Database" 
        subtitle="Honoring Those Who Served" 
      />
      
      <div className="logo-container">
        {showLogo && (
          <img src={logo} className="App-logo" alt="logo" />
        )}
        <button onClick={() => setShowLogo(!showLogo)} className="btn btn-primary">
          {showLogo ? 'Hide Logo' : 'Show Logo'}
        </button>
      </div>

      <VeteranList />
    </div>
  );
}

export default App;
