import React, { useState } from 'react';
import './Content.css';
import sampleImage from './JesseDefonce.jpeg';

function Content({ description }) {
  const [count, setCount] = useState(0);

  return (
    <div className="content">
      <p>{description}</p>
      <img src={sampleImage} alt="Sample" />
      <div>
        <p>Counter: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increase Count</button>
      </div>
    </div>
  );
}

export default Content;