import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

function AddVeteran() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    serviceNumber: '',
    branch: '',
    rank: '',
    yearsOfService: '',
    specializations: '',
    contactInfo: {
      email: '',
      phone: ''
    }
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'phone') {
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert yearsOfService to number
      const dataToSubmit = {
        ...formData,
        yearsOfService: formData.yearsOfService ? Number(formData.yearsOfService) : undefined
      };

      const response = await axios.post(
        'http://localhost:5000/api/veterans',
        dataToSubmit,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setAlert({
        open: true,
        message: response.data.message || 'Veteran added successfully!',
        severity: 'success'
      });

      setTimeout(() => {
        navigate('/veterans');
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding veteran';
      setAlert({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: 'rgba(255,255,255,0.9)' }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Add New Veteran
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField
              required
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              required
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              required
              name="serviceNumber"
              label="Service Number"
              value={formData.serviceNumber}
              onChange={handleChange}
            />
            <FormControl required>
              <InputLabel>Branch</InputLabel>
              <Select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                label="Branch"
              >
                <MenuItem value="Army">Army</MenuItem>
                <MenuItem value="Navy">Navy</MenuItem>
                <MenuItem value="Air Force">Air Force</MenuItem>
                <MenuItem value="Marines">Marines</MenuItem>
                <MenuItem value="Coast Guard">Coast Guard</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="rank"
              label="Rank"
              value={formData.rank}
              onChange={handleChange}
            />
            <TextField
              name="yearsOfService"
              label="Years of Service"
              type="number"
              value={formData.yearsOfService}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 4,
              width: '100%',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Veteran'}
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddVeteran;