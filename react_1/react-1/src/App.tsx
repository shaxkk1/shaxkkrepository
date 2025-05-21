// app.tsx
// Basic Stuff
import "./styles.css";
import { useState, useEffect } from "react";

//Name component
const name = "Mason";

// Other Components
import Title from "./Components/Title";
import Card from "./Components/Card";

// Images
import puma from "./images/pumalogo.png";
import nike from "./images/nike.png";
import adidas from "./images/adidas.png";

export default function App() {
  const [upvote, setUpvote] = useState(0);

  function like() {
    setUpvote(upvote + 1);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      alert("20% off any product you add to the cart today!");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <Title />

      <div className="brand-images">
        <img src={puma} alt="Puma Logo" width="100" />
        <img src={nike} alt="Nike Logo" width="100" />
        <img src={adidas} alt="Adidas Logo" width="100" />
      </div>

      <p>{upvote}</p>

      <button onClick={like}>👍</button>
      <Card
        Name={name}
        Work="Mechanical Engineer"
        tel="203-675-9473"
        email="5@gmail.com"
        img={nike}
      />
      <Card
        Name="Rohan"
        Work="AI Influencer"
        tel="203-675-9473"
        email="pi95@gmail.com"
        img={puma}
      />
      <Card
        Name="Jinu"
        Work="Drum Player"
        tel="203-675-9473"
        email="dcccp95@gmail.com"
        img={adidas}
      />
      <Card
        Name="Thai"
        Work="Librarian"
        tel="203-675-9473"
        email="pigstep95@gmail.com"
      />
    </div>
  );
}
