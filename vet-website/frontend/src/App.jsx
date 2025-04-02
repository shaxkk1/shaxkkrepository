import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VeteranList from './components/VeteranList';
import AddVeteran from './components/AddVeteran';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/veterans" element={<VeteranList />} />
          <Route path="/add" element={<AddVeteran />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
