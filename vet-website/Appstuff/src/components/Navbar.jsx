import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

const StyledButton = styled(Button)({
  color: 'white',
  '&:hover': {
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease-in-out',
    textShadow: '0 0 10px rgba(255,255,255,0.5)'
  }
});

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Veterans Support Network
        </Typography>
        <Box>
          <StyledButton component={Link} to="/">Home</StyledButton>
          <StyledButton component={Link} to="/veterans">Veterans</StyledButton>
          <StyledButton component={Link} to="/add">Add Veteran</StyledButton>
          <StyledButton component={Link} to="/search">
            <SearchIcon sx={{ mr: 1 }} />
            Search
          </StyledButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;