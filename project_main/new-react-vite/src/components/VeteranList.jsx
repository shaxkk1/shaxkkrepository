import { useState } from 'react';
import VeteranCard from './VeteranCard';
import './VeteranList.css';

function VeteranList() {
  const [veterans] = useState([
    {
      id: 1,
      name: "John Doe",
      rank: "Sergeant",
      branch: "Army",
      awards: "Purple Heart"
    },
    {
      id: 2,
      name: "Jane Smith",
      rank: "Captain",
      branch: "Air Force",
      awards: "Bronze Star"
    }
  ]);

  return (
    <div className="veteran-list">
      <h2>Our Veterans</h2>
      <div className="veterans-grid">
        {veterans.map(veteran => (
          <VeteranCard
            key={veteran.id}
            name={veteran.name}
            rank={veteran.rank}
            branch={veteran.branch}
            awards={veteran.awards}
          />
        ))}
      </div>
    </div>
  );
}

export default VeteranList;