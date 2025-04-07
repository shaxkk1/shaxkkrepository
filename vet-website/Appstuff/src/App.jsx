import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import VeteranList from './components/VeteranList';
import AddVeteran from './components/AddVeteran';
import SearchVeterans from './components/SearchVeterans';
import Home from './components/Home';

function App() {
  const [veterans, setVeterans] = useState([]);

  useEffect(() => {
    const fetchVeterans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/veterans');
        setVeterans(response.data);
      } catch (error) {
        console.error('Error fetching veterans:', error);
      }
    };
    fetchVeterans();
  }, []);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/veterans" element={<VeteranList />} />
          <Route path="/add" element={<AddVeteran />} />
          <Route path="/search" element={<SearchVeterans veterans={veterans} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
