import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  Button 
} from '@mui/material';
import axios from 'axios';

function VeteranList() {
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
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {veterans.map((veteran) => (
          <Grid item xs={12} sm={6} md={4} key={veteran._id}>
            <Card 
              sx={{
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s ease-in-out'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6">
                  {veteran.firstName} {veteran.lastName}
                </Typography>
                <Typography color="textSecondary">
                  Branch: {veteran.branch}
                </Typography>
                <Typography color="textSecondary">
                  Rank: {veteran.rank}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default VeteranList;