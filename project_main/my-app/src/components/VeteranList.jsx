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
      birthDate: "1945-03-15",
      deathDate: "2015-08-22",
      awards: "Purple Heart",
      photo: "https://example.com/veteran1.jpg"
    },
    {
      id: 2,
      name: "Jane Smith",
      rank: "Captain",
      branch: "Air Force",
      birthDate: "1952-06-10",
      deathDate: "2020-11-30",
      awards: "Bronze Star",
      photo: "https://example.com/veteran2.jpg"
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
            birthDate={veteran.birthDate}
            deathDate={veteran.deathDate}
            awards={veteran.awards}
            photo={veteran.photo}
          />
        ))}
      </div>
    </div>
  );
}

export default VeteranList;