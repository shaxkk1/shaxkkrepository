import './VeteranCard.css';
import defaultPhoto from '../assets/veteran-placeholder.jpg';

function VeteranCard({ name, rank, branch, birthDate, deathDate, awards, photo }) {
  return (
    <div className="veteran-card">
      <img 
        src={photo || defaultPhoto} 
        alt={`Veteran ${name}`} 
        className="veteran-photo"
        onError={(e) => {e.target.src = defaultPhoto}}
      />
      <div className="veteran-info">
        <h3>{name}</h3>
        <p className="rank">{rank}</p>
        <p className="branch">{branch}</p>
        <p className="dates">
          {birthDate} - {deathDate}
        </p>
        <p className="awards">{awards}</p>
      </div>
    </div>
  );
}

export default VeteranCard;