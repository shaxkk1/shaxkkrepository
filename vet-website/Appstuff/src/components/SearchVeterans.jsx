import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';

function SearchVeterans() {
  const [searchBranch, setSearchBranch] = useState('');
  const [filteredVeterans, setFilteredVeterans] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);

  // Fetch available branches when component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/branches');
        setBranches(response.data);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branch data. Please try again later.');
      }
    };
    
    fetchBranches();
  }, []);

  const handleSearch = async () => {
    if (!searchBranch.trim()) {
      setError('Please enter a military branch');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/veterans/branch/${searchBranch}`);
      setFilteredVeterans(response.data);
      setHasSearched(true);
    } catch (err) {
      console.error('Error searching veterans:', err);
      setError('Failed to search veterans. Please try again.');
      setFilteredVeterans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchBranch('');
    setFilteredVeterans([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Veteran Search Application
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Search for veterans by military branch
        </Typography>
      </Box>

      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Enter military branch"
                  value={searchBranch}
                  onChange={(e) => setSearchBranch(e.target.value)}
                  placeholder="e.g., Army, Navy, Air Force"
                  helperText={branches.length > 0 ? `Available branches: ${branches.map(b => b.BranchName).join(', ')}` : ''}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                  disabled={loading}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>

          {hasSearched && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search Results
                </Typography>
                {filteredVeterans.length > 0 ? (
                  filteredVeterans.map((veteran) => (
                    <Box key={veteran.VeteranID} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                      <Typography variant="subtitle1">
                        <strong>Name:</strong> {veteran.FirstName} {veteran.MiddleName ? veteran.MiddleName + ' ' : ''}{veteran.LastName}
                      </Typography>
                      <Typography color="text.secondary">
                        <strong>Rank:</strong> {veteran.RankName}
                      </Typography>
                      <Typography color="text.secondary">
                        <strong>Years of Service:</strong> {veteran.ServiceStartDate ? new Date(veteran.ServiceStartDate).getFullYear() : ''} - 
                        {veteran.ServiceEndDate ? new Date(veteran.ServiceEndDate).getFullYear() : 'Present'}
                      </Typography>
                      <Typography color="text.secondary">
                        <strong>Conflict/War:</strong> {veteran.ConflictName}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Alert severity="info">
                    No information recorded. Try another military branch.
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default SearchVeterans;