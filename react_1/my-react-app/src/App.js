import React from 'react';
import Header from './Header';
import Content from './Content';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header title="Welcome to My React App" />
      <Content description="This is a simple React app demonstrating the required criteria." />
    </div>
  );
}

export default App;