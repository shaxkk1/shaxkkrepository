import PropTypes from 'prop-types'
import './Header.css'

function Header({ title, subtitle }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}

export default Header