import { Box, Typography, Container } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: `${fadeIn} 1s ease-out`
        }}
      >
        <Typography
          variant="h2"
          sx={{
            mb: 4,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Welcome to Veterans Support Network
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Honoring Those Who Served
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;