import PropTypes from 'prop-types';
import './Header.css';

function Header({ title, subtitle }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
};

export default Header;