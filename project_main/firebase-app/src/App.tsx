// App.js
import "./styles.css";
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export default function App() {
  // Auth states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState("comments");

  // Comment states
  const [comment, setComment] = useState("");
  const [messages, setMessages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editComment, setEditComment] = useState("");

  // Veterans states
  const [veterans, setVeterans] = useState([]);
  const [editVeteranId, setEditVeteranId] = useState(null);
  const [veteranForm, setVeteranForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    branch: "",
    rank: "",
    conflictWar: "",
    dateOfBirth: "",
    dateOfDeath: "",
    serviceDateStart: "",
    serviceDateEnd: "",
    additionalInfo: "",
  });

  // Collections references - using consistent db reference
  const commentsRef = collection(db, "comments");
  const veteransRef = collection(db, "veterans");

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        getComments();
        getVeterans();
      } else {
        setMessages([]);
        setVeterans([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Authentication functions
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User signed up successfully!");
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("User logged in successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      alert(error.message);
    }
  };

  // Comment functions
  const getComments = async () => {
    if (!user) return;

    try {
      const q = query(commentsRef, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error getting comments:", error);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!user || !comment.trim()) {
      return;
    }

    try {
      await addDoc(commentsRef, {
        comment: comment.trim(),
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });
      console.log("Comment added");
      setComment("");
      getComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment: " + error.message);
    }
  };

  const updateComment = async () => {
    if (!editId || !user || !editComment.trim()) return;

    try {
      const commentDoc = doc(db, "comments", editId);
      await updateDoc(commentDoc, {
        comment: editComment.trim(),
        updatedAt: serverTimestamp(),
      });
      console.log("Comment updated");
      setEditId(null);
      setEditComment("");
      getComments();
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Error updating comment: " + error.message);
    }
  };

  const deleteComment = async (id) => {
    if (!user) return;

    try {
      const commentDoc = doc(db, "comments", id);
      await deleteDoc(commentDoc);
      console.log("Comment deleted");
      getComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment: " + error.message);
    }
  };

  const handleEdit = (message) => {
    if (message.userId === user?.uid) {
      setEditId(message.id);
      setEditComment(message.comment);
    } else {
      alert("You can only edit your own comments");
    }
  };

  // Veterans functions
  const getVeterans = async () => {
    if (!user) return;

    try {
      const q = query(veteransRef, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      const veteransData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setVeterans(veteransData);
    } catch (error) {
      console.error("Error getting veterans:", error);
      // Fallback to empty array if there's an error
      setVeterans([]);
    }
  };

  const resetVeteranForm = () => {
    setVeteranForm({
      firstName: "",
      middleName: "",
      lastName: "",
      branch: "",
      rank: "",
      conflictWar: "",
      dateOfBirth: "",
      dateOfDeath: "",
      serviceDateStart: "",
      serviceDateEnd: "",
      additionalInfo: "",
    });
  };

  const handleVeteranFormChange = (field, value) => {
    setVeteranForm((prev) => ({ ...prev, [field]: value }));
  };

  const addVeteran = async (e) => {
    if (e) e.preventDefault();

    if (!veteranForm.firstName.trim() || !veteranForm.lastName.trim()) {
      alert("First Name and Last Name are required");
      return;
    }

    try {
      console.log("Attempting to add veteran...", veteranForm);

      const newVeteran = {
        firstName: veteranForm.firstName.trim(),
        middleName: veteranForm.middleName.trim(),
        lastName: veteranForm.lastName.trim(),
        branch: veteranForm.branch.trim(),
        rank: veteranForm.rank.trim(),
        conflictWar: veteranForm.conflictWar.trim(),
        dateOfBirth: veteranForm.dateOfBirth || null,
        dateOfDeath: veteranForm.dateOfDeath || null,
        serviceDateStart: veteranForm.serviceDateStart || null,
        serviceDateEnd: veteranForm.serviceDateEnd || null,
        additionalInfo: veteranForm.additionalInfo.trim(),
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Save to Firebase
      const docRef = await addDoc(veteransRef, newVeteran);
      console.log("Veteran added successfully with ID:", docRef.id);

      // Refresh the veterans list
      await getVeterans();

      resetVeteranForm();
      alert("Veteran added successfully!");
    } catch (error) {
      console.error("Error adding veteran:", error);
      console.error("Error details:", error.code, error.message);
      alert(`Failed to add veteran: ${error.message}`);
    }
  };

  const updateVeteran = async (e) => {
    if (e) e.preventDefault();

    if (!veteranForm.firstName.trim() || !veteranForm.lastName.trim()) {
      alert("First Name and Last Name are required");
      return;
    }

    if (!editVeteranId) {
      alert("No veteran selected for editing");
      return;
    }

    try {
      const updatedVeteran = {
        firstName: veteranForm.firstName.trim(),
        middleName: veteranForm.middleName.trim(),
        lastName: veteranForm.lastName.trim(),
        branch: veteranForm.branch.trim(),
        rank: veteranForm.rank.trim(),
        conflictWar: veteranForm.conflictWar.trim(),
        dateOfBirth: veteranForm.dateOfBirth || null,
        dateOfDeath: veteranForm.dateOfDeath || null,
        serviceDateStart: veteranForm.serviceDateStart || null,
        serviceDateEnd: veteranForm.serviceDateEnd || null,
        additionalInfo: veteranForm.additionalInfo.trim(),
        updatedAt: serverTimestamp(),
      };

      const veteranDoc = doc(db, "veterans", editVeteranId);
      await updateDoc(veteranDoc, updatedVeteran);

      console.log("Veteran updated successfully");

      // Refresh the veterans list
      await getVeterans();

      setEditVeteranId(null);
      resetVeteranForm();
      alert("Veteran updated successfully!");
    } catch (error) {
      console.error("Error updating veteran:", error);
      alert(`Failed to update veteran: ${error.message}`);
    }
  };

  const deleteVeteran = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this veteran record?")
    ) {
      return;
    }

    try {
      const veteranDoc = doc(db, "veterans", id);
      await deleteDoc(veteranDoc);
      console.log("Veteran deleted successfully");

      // Refresh the veterans list
      await getVeterans();

      alert("Veteran deleted successfully!");
    } catch (error) {
      console.error("Error deleting veteran:", error);
      alert(`Failed to delete veteran: ${error.message}`);
    }
  };

  const handleEditVeteran = (veteran) => {
    if (veteran.userId === user?.uid) {
      setEditVeteranId(veteran.id);
      setVeteranForm({
        firstName: veteran.firstName || "",
        middleName: veteran.middleName || "",
        lastName: veteran.lastName || "",
        branch: veteran.branch || "",
        rank: veteran.rank || "",
        conflictWar: veteran.conflictWar || "",
        dateOfBirth: veteran.dateOfBirth || "",
        dateOfDeath: veteran.dateOfDeath || "",
        serviceDateStart: veteran.serviceDateStart || "",
        serviceDateEnd: veteran.serviceDateEnd || "",
        additionalInfo: veteran.additionalInfo || "",
      });
    } else {
      alert("You can only edit your own veteran records");
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "Not specified";

    // Handle Firestore timestamp objects
    if (date && date.toDate) {
      return date.toDate().toLocaleDateString();
    }

    // Handle regular Date objects or strings
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Show authentication forms if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            Firebase Auth & Veterans Management
          </h1>

          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-l-lg ${
                authMode === "login"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-r-lg ${
                authMode === "signup"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setAuthMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {authMode === "signup" ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Create Account</h2>
              <form onSubmit={handleSignUp} className="space-y-4">
                <input
                  type="text"
                  placeholder="Display Name (optional)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Sign Up
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Login
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main app interface (when logged in)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Firebase Auth & Veterans Management
        </h1>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
          <div>
            <p>
              <strong>Logged in as:</strong> {user.email}
            </p>
            <small className="text-gray-600">User ID: {user.uid}</small>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-3 px-6 rounded-l-lg ${
              activeTab === "comments"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
          <button
            className={`flex-1 py-3 px-6 rounded-r-lg ${
              activeTab === "veterans"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("veterans")}
          >
            Veterans Management
          </button>
        </div>

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Add a Comment</h2>

            <form onSubmit={addComment} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Write your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Comment
              </button>
            </form>

            <h3 className="text-xl font-semibold mb-4">
              All Comments ({messages.length})
            </h3>

            {messages.length === 0 ? (
              <p className="text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {editId === message.id ? (
                      <div>
                        <input
                          type="text"
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mb-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={updateComment}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditId(null);
                              setEditComment("");
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-blue-600">
                            {message.userEmail || "Anonymous"}
                          </span>
                          {message.createdAt && (
                            <span className="text-sm text-gray-500">
                              {new Date(
                                message.createdAt.seconds * 1000
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="mb-2">{message.comment}</p>
                        {message.userId === user.uid && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(message)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this comment?"
                                  )
                                ) {
                                  deleteComment(message.id);
                                }
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Veterans Tab */}
        {activeTab === "veterans" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {editVeteranId ? "Edit Veteran" : "Add New Veteran"}
            </h2>

            {/* Veteran Form */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={veteranForm.firstName}
                  onChange={(e) =>
                    handleVeteranFormChange("firstName", e.target.value)
                  }
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Middle Name"
                  value={veteranForm.middleName}
                  onChange={(e) =>
                    handleVeteranFormChange("middleName", e.target.value)
                  }
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={veteranForm.lastName}
                  onChange={(e) =>
                    handleVeteranFormChange("lastName", e.target.value)
                  }
                  required
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Branch (e.g., U.S. Navy)"
                  value={veteranForm.branch}
                  onChange={(e) =>
                    handleVeteranFormChange("branch", e.target.value)
                  }
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Rank (e.g., Private)"
                  value={veteranForm.rank}
                  onChange={(e) =>
                    handleVeteranFormChange("rank", e.target.value)
                  }
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Conflict/War (e.g., Vietnam War)"
                  value={veteranForm.conflictWar}
                  onChange={(e) =>
                    handleVeteranFormChange("conflictWar", e.target.value)
                  }
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="datetime-local"
                    value={veteranForm.dateOfBirth}
                    onChange={(e) =>
                      handleVeteranFormChange("dateOfBirth", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Death
                  </label>
                  <input
                    type="datetime-local"
                    value={veteranForm.dateOfDeath}
                    onChange={(e) =>
                      handleVeteranFormChange("dateOfDeath", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={veteranForm.serviceDateStart}
                    onChange={(e) =>
                      handleVeteranFormChange(
                        "serviceDateStart",
                        e.target.value
                      )
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={veteranForm.serviceDateEnd}
                    onChange={(e) =>
                      handleVeteranFormChange("serviceDateEnd", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  placeholder="Additional information about the veteran..."
                  value={veteranForm.additionalInfo}
                  onChange={(e) =>
                    handleVeteranFormChange("additionalInfo", e.target.value)
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={editVeteranId ? updateVeteran : addVeteran}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editVeteranId ? "Update Veteran" : "Add Veteran"}
                </button>
                {editVeteranId && (
                  <button
                    onClick={() => {
                      setEditVeteranId(null);
                      resetVeteranForm();
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Veterans List */}
            <h3 className="text-xl font-semibold mb-4">
              All Veterans ({veterans.length})
            </h3>

            {veterans.length === 0 ? (
              <p className="text-gray-600">
                No veterans registered yet. Add the first veteran record!
              </p>
            ) : (
              <div className="space-y-4">
                {veterans.map((veteran) => (
                  <div
                    key={veteran.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-blue-600">
                        {veteran.firstName} {veteran.middleName}{" "}
                        {veteran.lastName}
                      </h4>
                      <div className="text-sm text-gray-500">
                        ID: {veteran.id}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <strong>Branch:</strong>{" "}
                        {veteran.branch || "Not specified"}
                      </div>
                      <div>
                        <strong>Rank:</strong> {veteran.rank || "Not specified"}
                      </div>
                      <div>
                        <strong>Conflict/War:</strong>{" "}
                        {veteran.conflictWar || "Not specified"}
                      </div>
                      <div>
                        <strong>Date of Birth:</strong>{" "}
                        {formatDateTime(veteran.dateOfBirth)}
                      </div>
                      <div>
                        <strong>Date of Death:</strong>{" "}
                        {formatDateTime(veteran.dateOfDeath)}
                      </div>
                      <div>
                        <strong>Service Period:</strong>
                        <br />
                        <small>
                          Start: {formatDateTime(veteran.serviceDateStart)}
                          <br />
                          End: {formatDateTime(veteran.serviceDateEnd)}
                        </small>
                      </div>
                    </div>

                    {veteran.additionalInfo && (
                      <div className="mb-4">
                        <strong>Additional Information:</strong>
                        <p className="text-gray-700 mt-1">
                          {veteran.additionalInfo}
                        </p>
                      </div>
                    )}

                    {veteran.userId === user.uid && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditVeteran(veteran)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteVeteran(veteran.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
