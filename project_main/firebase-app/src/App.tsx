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
  const [activeTab, setActiveTab] = useState("about");

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

  // Add these new state variables to your existing useState declarations:
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    branch: "",
    conflict: "",
    rank: "",
    dateRange: {
      start: "",
      end: "",
    },
  });
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState("lastName"); // lastName, firstName, dateOfDeath, branch
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  const [reportType, setReportType] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [reportData, setReportData] = useState(null);

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

  const resetSearchFilters = () => {
    setSearchFilters({
      branch: "",
      conflict: "",
      rank: "",
      dateRange: {
        start: "",
        end: "",
      },
    });
    setSearchTerm("");
    setSearchResults([]);
  };

  const performSearch = () => {
    setIsSearching(true);

    let results = [...veterans];

    // Text search across multiple fields
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (veteran) =>
          veteran.firstName?.toLowerCase().includes(term) ||
          veteran.middleName?.toLowerCase().includes(term) ||
          veteran.lastName?.toLowerCase().includes(term) ||
          veteran.branch?.toLowerCase().includes(term) ||
          veteran.rank?.toLowerCase().includes(term) ||
          veteran.conflictWar?.toLowerCase().includes(term) ||
          veteran.additionalInfo?.toLowerCase().includes(term)
      );
    }

    // Filter by branch
    if (searchFilters.branch) {
      results = results.filter((veteran) =>
        veteran.branch
          ?.toLowerCase()
          .includes(searchFilters.branch.toLowerCase())
      );
    }

    // Filter by conflict/war
    if (searchFilters.conflict) {
      results = results.filter((veteran) =>
        veteran.conflictWar
          ?.toLowerCase()
          .includes(searchFilters.conflict.toLowerCase())
      );
    }

    // Filter by rank
    if (searchFilters.rank) {
      results = results.filter((veteran) =>
        veteran.rank?.toLowerCase().includes(searchFilters.rank.toLowerCase())
      );
    }

    // Filter by date range (using date of death)
    if (searchFilters.dateRange.start || searchFilters.dateRange.end) {
      results = results.filter((veteran) => {
        if (!veteran.dateOfDeath) return false;

        let veteranDate;
        if (veteran.dateOfDeath.toDate) {
          veteranDate = veteran.dateOfDeath.toDate();
        } else {
          veteranDate = new Date(veteran.dateOfDeath);
        }

        const startDate = searchFilters.dateRange.start
          ? new Date(searchFilters.dateRange.start)
          : null;
        const endDate = searchFilters.dateRange.end
          ? new Date(searchFilters.dateRange.end)
          : null;

        if (startDate && veteranDate < startDate) return false;
        if (endDate && veteranDate > endDate) return false;

        return true;
      });
    }

    // Sort results
    results.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "firstName":
          aValue = a.firstName?.toLowerCase() || "";
          bValue = b.firstName?.toLowerCase() || "";
          break;
        case "lastName":
          aValue = a.lastName?.toLowerCase() || "";
          bValue = b.lastName?.toLowerCase() || "";
          break;
        case "branch":
          aValue = a.branch?.toLowerCase() || "";
          bValue = b.branch?.toLowerCase() || "";
          break;
        case "dateOfDeath":
          aValue = a.dateOfDeath
            ? a.dateOfDeath.toDate
              ? a.dateOfDeath.toDate()
              : new Date(a.dateOfDeath)
            : new Date(0);
          bValue = b.dateOfDeath
            ? b.dateOfDeath.toDate
              ? b.dateOfDeath.toDate()
              : new Date(b.dateOfDeath)
            : new Date(0);
          break;
        default:
          aValue = a.lastName?.toLowerCase() || "";
          bValue = b.lastName?.toLowerCase() || "";
      }

      if (sortBy === "dateOfDeath") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearchFilterChange = (field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateRangeChange = (field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    const values = veterans
      .map((veteran) => veteran[field])
      .filter((value) => value && value.trim())
      .map((value) => value.trim());
    return [...new Set(values)].sort();
  };

  const generateStatistics = () => {
    if (veterans.length === 0) {
      return {
        totalVeterans: 0,
        branches: {},
        conflicts: {},
        ranks: {},
        decades: {},
        recentAdditions: 0,
        averageAge: 0,
      };
    }

    const stats = {
      totalVeterans: veterans.length,
      branches: {},
      conflicts: {},
      ranks: {},
      decades: {},
      recentAdditions: 0,
      totalAge: 0,
      veteransWithAge: 0,
    };

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    veterans.forEach((veteran) => {
      // Count branches
      if (veteran.branch) {
        const branch = veteran.branch.trim();
        stats.branches[branch] = (stats.branches[branch] || 0) + 1;
      }

      // Count conflicts
      if (veteran.conflictWar) {
        const conflict = veteran.conflictWar.trim();
        stats.conflicts[conflict] = (stats.conflicts[conflict] || 0) + 1;
      }

      // Count ranks
      if (veteran.rank) {
        const rank = veteran.rank.trim();
        stats.ranks[rank] = (stats.ranks[rank] || 0) + 1;
      }

      // Count by death decade
      if (veteran.dateOfDeath) {
        let deathDate;
        if (veteran.dateOfDeath.toDate) {
          deathDate = veteran.dateOfDeath.toDate();
        } else {
          deathDate = new Date(veteran.dateOfDeath);
        }

        if (!isNaN(deathDate.getFullYear())) {
          const decade = Math.floor(deathDate.getFullYear() / 10) * 10;
          const decadeLabel = `${decade}s`;
          stats.decades[decadeLabel] = (stats.decades[decadeLabel] || 0) + 1;
        }
      }

      // Count recent additions
      if (veteran.createdAt) {
        let createdDate;
        if (veteran.createdAt.toDate) {
          createdDate = veteran.createdAt.toDate();
        } else {
          createdDate = new Date(veteran.createdAt);
        }

        if (createdDate > oneMonthAgo) {
          stats.recentAdditions++;
        }
      }

      // Calculate age at death
      if (veteran.dateOfBirth && veteran.dateOfDeath) {
        let birthDate, deathDate;

        if (veteran.dateOfBirth.toDate) {
          birthDate = veteran.dateOfBirth.toDate();
        } else {
          birthDate = new Date(veteran.dateOfBirth);
        }

        if (veteran.dateOfDeath.toDate) {
          deathDate = veteran.dateOfDeath.toDate();
        } else {
          deathDate = new Date(veteran.dateOfDeath);
        }

        if (
          !isNaN(birthDate.getFullYear()) &&
          !isNaN(deathDate.getFullYear())
        ) {
          const age = deathDate.getFullYear() - birthDate.getFullYear();
          if (age > 0 && age < 120) {
            // Reasonable age range
            stats.totalAge += age;
            stats.veteransWithAge++;
          }
        }
      }
    });

    stats.averageAge =
      stats.veteransWithAge > 0
        ? Math.round(stats.totalAge / stats.veteransWithAge)
        : 0;

    return stats;
  };

  const generateReport = () => {
    const stats = generateStatistics();

    const report = {
      overview: {
        totalVeterans: stats.totalVeterans,
        recentAdditions: stats.recentAdditions,
        averageAge: stats.averageAge,
        topBranch:
          Object.keys(stats.branches).length > 0
            ? Object.keys(stats.branches).reduce((a, b) =>
                stats.branches[a] > stats.branches[b] ? a : b
              )
            : "N/A",
        topConflict:
          Object.keys(stats.conflicts).length > 0
            ? Object.keys(stats.conflicts).reduce((a, b) =>
                stats.conflicts[a] > stats.conflicts[b] ? a : b
              )
            : "N/A",
      },
      branches: Object.keys(stats.branches)
        .map((branch) => ({ name: branch, count: stats.branches[branch] }))
        .sort((a, b) => b.count - a.count),
      conflicts: Object.keys(stats.conflicts)
        .map((conflict) => ({
          name: conflict,
          count: stats.conflicts[conflict],
        }))
        .sort((a, b) => b.count - a.count),
      ranks: Object.keys(stats.ranks)
        .map((rank) => ({ name: rank, count: stats.ranks[rank] }))
        .sort((a, b) => b.count - a.count),
      decades: Object.keys(stats.decades)
        .map((decade) => ({ name: decade, count: stats.decades[decade] }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };

    setReportData(report);
  };

  const exportReport = () => {
    if (!reportData) {
      generateReport();
      return;
    }

    const reportContent = `
  Veterans Cemetery Database Report
  Generated: ${new Date().toLocaleDateString()}
  
  OVERVIEW STATISTICS
  ===================
  Total Veterans: ${reportData.overview.totalVeterans}
  Recent Additions (Last 30 days): ${reportData.overview.recentAdditions}
  Average Age at Death: ${
    reportData.overview.averageAge > 0
      ? reportData.overview.averageAge + " years"
      : "Not available"
  }
  Most Common Branch: ${reportData.overview.topBranch}
  Most Common Conflict: ${reportData.overview.topConflict}
  
  VETERANS BY BRANCH
  ==================
  ${reportData.branches
    .map(
      (item) =>
        `${item.name}: ${item.count} (${(
          (item.count / reportData.overview.totalVeterans) *
          100
        ).toFixed(1)}%)`
    )
    .join("\n")}
  
  VETERANS BY CONFLICT/WAR
  ========================
  ${reportData.conflicts
    .map(
      (item) =>
        `${item.name}: ${item.count} (${(
          (item.count / reportData.overview.totalVeterans) *
          100
        ).toFixed(1)}%)`
    )
    .join("\n")}
  
  VETERANS BY RANK
  ================
  ${reportData.ranks
    .map(
      (item) =>
        `${item.name}: ${item.count} (${(
          (item.count / reportData.overview.totalVeterans) *
          100
        ).toFixed(1)}%)`
    )
    .join("\n")}
  
  VETERANS BY DEATH DECADE
  ========================
  ${reportData.decades
    .map(
      (item) =>
        `${item.name}: ${item.count} (${(
          (item.count / reportData.overview.totalVeterans) *
          100
        ).toFixed(1)}%)`
    )
    .join("\n")}
  
  ---
  Report generated by Veterans Cemetery Database
  `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `veterans_report_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    if (!reportData) {
      generateReport();
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Veterans Cemetery Database Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #1e40af; border-bottom: 2px solid #1e40af; }
            h2 { color: #374151; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f3f4f6; }
            .overview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .stat-number { font-size: 24px; font-weight: bold; color: #1e40af; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>Veterans Cemetery Database Report</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h2>Overview Statistics</h2>
          <div class="overview-grid">
            <div class="stat-card">
              <div>Total Veterans</div>
              <div class="stat-number">${
                reportData.overview.totalVeterans
              }</div>
            </div>
            <div class="stat-card">
              <div>Recent Additions</div>
              <div class="stat-number">${
                reportData.overview.recentAdditions
              }</div>
            </div>
            <div class="stat-card">
              <div>Average Age at Death</div>
              <div class="stat-number">${
                reportData.overview.averageAge > 0
                  ? reportData.overview.averageAge
                  : "N/A"
              }</div>
            </div>
          </div>
  
          <h2>Veterans by Branch</h2>
          <table>
            <tr><th>Branch</th><th>Count</th><th>Percentage</th></tr>
            ${reportData.branches
              .map(
                (item) =>
                  `<tr><td>${item.name}</td><td>${item.count}</td><td>${(
                    (item.count / reportData.overview.totalVeterans) *
                    100
                  ).toFixed(1)}%</td></tr>`
              )
              .join("")}
          </table>
  
          <h2>Veterans by Conflict/War</h2>
          <table>
            <tr><th>Conflict/War</th><th>Count</th><th>Percentage</th></tr>
            ${reportData.conflicts
              .map(
                (item) =>
                  `<tr><td>${item.name}</td><td>${item.count}</td><td>${(
                    (item.count / reportData.overview.totalVeterans) *
                    100
                  ).toFixed(1)}%</td></tr>`
              )
              .join("")}
          </table>
  
          <h2>Veterans by Rank</h2>
          <table>
            <tr><th>Rank</th><th>Count</th><th>Percentage</th></tr>
            ${reportData.ranks
              .map(
                (item) =>
                  `<tr><td>${item.name}</td><td>${item.count}</td><td>${(
                    (item.count / reportData.overview.totalVeterans) *
                    100
                  ).toFixed(1)}%</td></tr>`
              )
              .join("")}
          </table>
  
          <h2>Veterans by Death Decade</h2>
          <table>
            <tr><th>Decade</th><th>Count</th><th>Percentage</th></tr>
            ${reportData.decades
              .map(
                (item) =>
                  `<tr><td>${item.name}</td><td>${item.count}</td><td>${(
                    (item.count / reportData.overview.totalVeterans) *
                    100
                  ).toFixed(1)}%</td></tr>`
              )
              .join("")}
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Auto-generate report when tab is accessed
  const handleStatsTabClick = () => {
    setActiveTab("statistics");
    generateReport();
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
            Veterans Cemetery Database
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
          Veterans Cemetery Database
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
              activeTab === "about"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
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
          <button
            className={`flex-1 py-3 px-6 rounded-l-lg ${
              activeTab === "about"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("search")}
          >
            Search
          </button>
          {/* Add this button to your existing tab navigation section */}
          <button
            className={`flex-1 py-3 px-6 ${
              activeTab === "statistics"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={handleStatsTabClick}
          >
            Statistics & Reports
          </button>
        </div>
        {/* Statistics & Reports Tab */}
        {activeTab === "statistics" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Statistics & Reports</h2>
              <div className="flex gap-2">
                <button
                  onClick={generateReport}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Refresh Data
                </button>
                <button
                  onClick={exportReport}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Export Report
                </button>
                <button
                  onClick={printReport}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Print Report
                </button>
              </div>
            </div>

            {!reportData ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-4">
                  Generating report...
                </div>
                <button
                  onClick={generateReport}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Generate Statistics
                </button>
              </div>
            ) : (
              <div>
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {reportData.overview.totalVeterans}
                    </div>
                    <div className="text-sm text-blue-800">Total Veterans</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {reportData.overview.recentAdditions}
                    </div>
                    <div className="text-sm text-green-800">
                      Added This Month
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {reportData.overview.averageAge > 0
                        ? reportData.overview.averageAge
                        : "N/A"}
                    </div>
                    <div className="text-sm text-purple-800">
                      Avg Age at Death
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {reportData.overview.topBranch}
                    </div>
                    <div className="text-sm text-orange-800">Top Branch</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-red-600">
                      {reportData.overview.topConflict}
                    </div>
                    <div className="text-sm text-red-800">Top Conflict</div>
                  </div>
                </div>

                {/* Report Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Veterans by Branch */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Veterans by Branch
                    </h3>
                    {reportData.branches.length > 0 ? (
                      <div className="space-y-2">
                        {reportData.branches.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200"
                          >
                            <span className="font-medium">{item.name}</span>
                            <div className="text-right">
                              <span className="font-bold text-blue-600">
                                {item.count}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                (
                                {(
                                  (item.count /
                                    reportData.overview.totalVeterans) *
                                  100
                                ).toFixed(1)}
                                %)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No branch data available</p>
                    )}
                  </div>

                  {/* Veterans by Conflict */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Veterans by Conflict/War
                    </h3>
                    {reportData.conflicts.length > 0 ? (
                      <div className="space-y-2">
                        {reportData.conflicts.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200"
                          >
                            <span className="font-medium">{item.name}</span>
                            <div className="text-right">
                              <span className="font-bold text-green-600">
                                {item.count}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                (
                                {(
                                  (item.count /
                                    reportData.overview.totalVeterans) *
                                  100
                                ).toFixed(1)}
                                %)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No conflict data available
                      </p>
                    )}
                  </div>

                  {/* Veterans by Rank */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Veterans by Rank
                    </h3>
                    {reportData.ranks.length > 0 ? (
                      <div className="space-y-2">
                        {reportData.ranks.slice(0, 10).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200"
                          >
                            <span className="font-medium">{item.name}</span>
                            <div className="text-right">
                              <span className="font-bold text-purple-600">
                                {item.count}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                (
                                {(
                                  (item.count /
                                    reportData.overview.totalVeterans) *
                                  100
                                ).toFixed(1)}
                                %)
                              </span>
                            </div>
                          </div>
                        ))}
                        {reportData.ranks.length > 10 && (
                          <div className="text-sm text-gray-500 pt-2">
                            ... and {reportData.ranks.length - 10} more ranks
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">No rank data available</p>
                    )}
                  </div>

                  {/* Veterans by Death Decade */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Veterans by Death Decade
                    </h3>
                    {reportData.decades.length > 0 ? (
                      <div className="space-y-2">
                        {reportData.decades.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-200"
                          >
                            <span className="font-medium">{item.name}</span>
                            <div className="text-right">
                              <span className="font-bold text-orange-600">
                                {item.count}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                (
                                {(
                                  (item.count /
                                    reportData.overview.totalVeterans) *
                                  100
                                ).toFixed(1)}
                                %)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No death date data available
                      </p>
                    )}
                  </div>
                </div>

                {/* Report Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
                  <p className="text-sm">
                    Report generated on {new Date().toLocaleDateString()} at{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                  <p className="text-xs mt-1">
                    Data includes {reportData.overview.totalVeterans} veteran
                    records from the Veterans Cemetery Database
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
              About Veterans Cemetery Database
            </h2>

            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  The Veterans Cemetery Database is a comprehensive digital
                  platform dedicated to preserving and honoring the memory of
                  our nation's heroes. This database serves as a centralized
                  repository for veteran records across various cemeteries,
                  ensuring that the service and sacrifice of our military
                  personnel are never forgotten.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    🏛️ Purpose & Vision
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      Preserve military service records for future generations
                    </li>
                    <li>
                      Provide families with accessible veteran information
                    </li>
                    <li> Support genealogical and historical research</li>
                    <li> Honor the memory of those who served</li>
                    <li> Create a lasting digital memorial</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    📊 Database Features
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li> Comprehensive veteran profiles</li>
                    <li> Service branch and rank information</li>
                    <li> Conflict and war participation records</li>
                    <li> Burial and cemetery location data</li>
                    <li> Secure, cloud-based storage</li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
                <h3 className="text-xl font-semibold text-green-800 mb-3">
                  How It Works
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our platform allows authorized users to contribute veteran
                  information from cemeteries across the country. Each record
                  includes essential details such as:
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <strong>Personal Information:</strong>
                    <br />
                    Names, birth/death dates, service periods
                  </div>
                  <div className="bg-white p-3 rounded">
                    <strong>Military Service:</strong>
                    <br />
                    Branch, rank, conflicts served, unit information
                  </div>
                  <div className="bg-white p-3 rounded">
                    <strong>Memorial Details:</strong>
                    <br />
                    Cemetery location, burial information, additional notes
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                <h3 className="text-xl font-semibold text-red-800 mb-3">
                  Honoring All Who Served
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  From the Revolutionary War to modern conflicts, this database
                  encompasses veterans from all eras of American military
                  service. Whether they served in the Army, Navy, Air Force,
                  Marines, Coast Guard, or Space Force, every veteran's story
                  deserves to be preserved and honored.
                </p>
              </div>

              <div className="text-center bg-gray-100 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Contributing to the Database
                </h3>
                <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
                  We welcome contributions from cemetery administrators,
                  genealogists, historians, and family members who wish to
                  ensure their loved ones' service is properly documented.
                  Together, we can build a comprehensive memorial that honors
                  all who answered the call to serve.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setActiveTab("veterans")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Add Veteran Record
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Leave a Comment
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center text-gray-600">
                <p className="italic">
                  "A nation that does not honor its heroes will not long
                  endure."
                </p>
                <p className="text-sm mt-2">
                  Thank you for helping us preserve the legacy of America's
                  veterans.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Search & Browse Tab */}
        {activeTab === "search" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
              Search & Browse Veterans
            </h2>

            {/* Search Controls */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              {/* Main Search Bar */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search veterans by name, branch, rank, conflict, or any keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      performSearch();
                    }
                  }}
                />
                <button
                  onClick={performSearch}
                  disabled={isSearching}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={searchFilters.branch}
                    onChange={(e) =>
                      handleSearchFilterChange("branch", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Branches</option>
                    {getUniqueValues("branch").map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conflict/War
                  </label>
                  <select
                    value={searchFilters.conflict}
                    onChange={(e) =>
                      handleSearchFilterChange("conflict", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Conflicts</option>
                    {getUniqueValues("conflictWar").map((conflict) => (
                      <option key={conflict} value={conflict}>
                        {conflict}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rank
                  </label>
                  <select
                    value={searchFilters.rank}
                    onChange={(e) =>
                      handleSearchFilterChange("rank", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Ranks</option>
                    {getUniqueValues("rank").map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lastName-asc">Last Name (A-Z)</option>
                    <option value="lastName-desc">Last Name (Z-A)</option>
                    <option value="firstName-asc">First Name (A-Z)</option>
                    <option value="firstName-desc">First Name (Z-A)</option>
                    <option value="branch-asc">Branch (A-Z)</option>
                    <option value="dateOfDeath-desc">
                      Date of Death (Newest)
                    </option>
                    <option value="dateOfDeath-asc">
                      Date of Death (Oldest)
                    </option>
                  </select>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Death Date From
                  </label>
                  <input
                    type="date"
                    value={searchFilters.dateRange.start}
                    onChange={(e) =>
                      handleDateRangeChange("start", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Death Date To
                  </label>
                  <input
                    type="date"
                    value={searchFilters.dateRange.end}
                    onChange={(e) =>
                      handleDateRangeChange("end", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={performSearch}
                  disabled={isSearching}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetSearchFilters}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    setSearchResults([...veterans]);
                    performSearch();
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse All ({veterans.length})
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {searchResults.length > 0
                    ? `Search Results (${searchResults.length})`
                    : searchTerm ||
                      Object.values(searchFilters).some(
                        (f) =>
                          f &&
                          (typeof f === "string"
                            ? f
                            : Object.values(f).some((v) => v))
                      )
                    ? "No Results Found"
                    : `All Veterans (${veterans.length})`}
                </h3>
                {searchResults.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Showing {searchResults.length} of {veterans.length} veterans
                  </div>
                )}
              </div>

              {/* Results Display */}
              {searchResults.length === 0 &&
              (searchTerm ||
                Object.values(searchFilters).some(
                  (f) =>
                    f &&
                    (typeof f === "string"
                      ? f
                      : Object.values(f).some((v) => v))
                )) ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg mb-2">
                    No veterans found matching your search criteria
                  </div>
                  <p className="text-gray-400">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg mb-2">
                    Use the search above to find veterans
                  </div>
                  <p className="text-gray-400">
                    Search by name, branch, conflict, or use the filters
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {searchResults.map((veteran) => (
                    <div
                      key={veteran.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-semibold text-blue-600">
                          {veteran.firstName} {veteran.middleName}{" "}
                          {veteran.lastName}
                        </h4>
                        <div className="text-sm text-gray-500 text-right">
                          <div>Added by: {veteran.userEmail}</div>
                          <div>ID: {veteran.id}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Branch:
                          </span>
                          <div className="text-gray-600">
                            {veteran.branch || "Not specified"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Rank:
                          </span>
                          <div className="text-gray-600">
                            {veteran.rank || "Not specified"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Conflict:
                          </span>
                          <div className="text-gray-600">
                            {veteran.conflictWar || "Not specified"}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Date of Death:
                          </span>
                          <div className="text-gray-600">
                            {formatDateTime(veteran.dateOfDeath)}
                          </div>
                        </div>
                      </div>

                      {veteran.additionalInfo && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="font-medium text-gray-700">
                            Additional Info:
                          </span>
                          <p className="text-gray-600 text-sm mt-1">
                            {veteran.additionalInfo}
                          </p>
                        </div>
                      )}

                      {veteran.userId === user.uid && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-green-600 font-medium">
                            ● Your Record
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
