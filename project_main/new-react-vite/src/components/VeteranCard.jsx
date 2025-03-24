import PropTypes from 'prop-types';
import './VeteranCard.css';
import veteranPlaceholder from '../assets/veteran-placeholder.jpg';

function VeteranCard({ name, rank, branch, awards }) {
  return (
    <div className="veteran-card">
      <img 
        src={veteranPlaceholder} 
        alt="Veteran placeholder" 
        className="veteran-image"
      />
      <h3>{name}</h3>
      <p className="rank">{rank}</p>
      <p className="branch">{branch}</p>
      <p className="awards">{awards}</p>
    </div>
  );
}

VeteranCard.propTypes = {
  name: PropTypes.string.isRequired,
  rank: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  awards: PropTypes.string
};

export default VeteranCard;