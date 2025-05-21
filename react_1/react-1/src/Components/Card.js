// Card.js
import "./Card.css";

// Either use the Heading component or remove it
function Heading() {
  return <h1>My Favorite Foods</h1>;
}

function Card(props) {
  const { Name, Work, img, tel, email } = props;

  return (
    <div className="card">
      <img
        src={
          img ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSicP7dG1voydTSHpaqz-O-u4OmKVxXdCxHQg&s"
        }
        width="200"
        alt="avatar"
      />
      <h1>{Name}</h1>
      <p>{Work}</p>
      {tel && <p>{tel}</p>}
      {email && <p>{email}</p>}
    </div>
  );
}

export default Card;
