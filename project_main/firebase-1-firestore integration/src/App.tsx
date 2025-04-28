import "./styles.css";
import { useState, useEffect } from "react";
import { database } from "./firebase";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc, // You need to import this
} from "firebase/firestore";

export default function App() {
  // State for comments
  const [comment, setComment] = useState("");
  const [messages, setMessages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editComment, setEditComment] = useState("");

  // Collections reference
  const commentsRef = collection(database, "comments");

  // Function to get comments
  const getComments = async () => {
    const data = await getDocs(commentsRef);
    setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Create: Add comment to database
  async function addComment(e) {
    e.preventDefault();
    await addDoc(commentsRef, { comment: comment });
    console.log("comment added");
    setComment(""); // Clear input
    getComments(); // Refresh comments
  }

  // Update: Edit existing comment
  async function updateComment() {
    if (editId) {
      const commentDoc = doc(database, "comments", editId);
      await updateDoc(commentDoc, { comment: editComment });
      console.log("comment updated");
      setEditId(null);
      setEditComment("");
      getComments(); // Refresh comments
    }
  }

  // Delete: Remove comment from database
  async function deleteComment(id) {
    const commentDoc = doc(database, "comments", id);
    await deleteDoc(commentDoc);
    console.log("comment deleted");
    getComments(); // Refresh comments
  }

  // Function to handle edit mode
  function handleEdit(message) {
    setEditId(message.id);
    setEditComment(message.comment);
  }

  // Load comments on component mount
  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="App">
      <h1>Firebase CRUD</h1>
      <h2>Comments</h2>

      <form onSubmit={addComment}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Add Comment</button>
      </form>

      <h3>What other people have said</h3>
      {messages.map((message) => (
        <div key={message.id} className="comment-container">
          {editId === message.id ? (
            // Edit form
            <div className="edit-form">
              <input
                type="text"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
              />
              <div className="edit-actions">
                <button className="save-btn" onClick={updateComment}>
                  Save
                </button>
                <button className="cancel-btn" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Display comment with edit/delete buttons
            <>
              <p className="comment-text">{message.comment}</p>
              <div className="comment-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(message)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteComment(message.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
