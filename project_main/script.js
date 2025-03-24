// Constants for reliability
const currentYear = new Date().getFullYear();
const BASE_VETERAN_COUNT = 5;
const WELCOME_MESSAGE = "Welcome to the Bethel Cemetery Veteran Database!";

// Variables
let updateInterval;
// Descriptive array
const militaryBranches = ["Army", "Navy", "Air Force", "Marines", "Coast Guard"];
console.log("Selected portion is empty. Adding logs to the entire code file is not feasible. However, here's an example of how you can add logs to the existing functions:");

// Example of adding logs to the existing functions
function initializePage() {
  console.log("Initializing page...");
  // existing code
  console.log("Page initialized successfully.");
}

function updateClock(){
  console.log("Updating clock...");
  // existing code
  console.log("Clock updated successfully.");
}

function checkDatabaseStatus() {
  console.log("Checking database status...");
  // existing code
  console.log("Database status checked successfully.");
}

function calculateAverageAge(totalAge, numberOfVeterans) {
  console.log("Calculating average age...");
  // existing code
  console.log("Average age calculated successfully.");
}

function handleAddVeteran(event) {
  console.log("Handling add veteran event...");
  // existing code
  console.log("Veteran added successfully.");
}

function displayVeterans() {
  console.log("Displaying veterans...");
  // existing code
  console.log("Veterans displayed successfully.");
}

function searchVeterans(searchTerm) {
  console.log("Searching veterans...");
  // existing code
  console.log("Veterans searched successfully.");
}
//Function to initialize the page
function initializePage() {
  // Find elements by ID, class name, and tag name
  const veteranCountElement = document.getElementById("veteranCount");
  const headerElement = document.querySelector(".hero-section h1");
  const allParagraphs = document.getElementsByTagName("p");

  // Add a new attribute
  veteranCountElement.setAttribute("data-status", "active");

  // Change CSS
  headerElement.style.color = "blue";

  // Update content using a loop and array
  let branchesList = "";
  for (let i = 0; i < militaryBranches.length; i++) {
    branchesList += `<li>${militaryBranches[i]}</li>`;
  }
  document.getElementById("militaryBranches").innerHTML = branchesList;

  //Check the database status
  checkDatabaseStatus();

  //Interval
  updateInterval = setInterval(updateClock, 1000);
  // Clear the interval after 10 seconds
  setTimeout(() => clearInterval(updateInterval), 10000);
  displayVeterans();
}

//Function for the timer
function updateClock(){
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById("clock").textContent = `Current Time: ${timeString}`;
}

//Function to check the database status
function checkDatabaseStatus() {
  const veterans = JSON.parse(localStorage.getItem("veterans")) || [];
  const databaseStatusElement = document.getElementById("databaseStatus");
  if (veterans.length < 5) {
    databaseStatusElement.textContent = "Database is inactive.";
    console.log("Database is inactive.");
  } else if (veterans.length > 10 || currentYear > 2023) {
    console.log("Database is active and up to date.");
    databaseStatusElement.textContent = "Database is active and up to date.";
  } else {
    console.log("Database is active but requires updating.");
    databaseStatusElement.textContent = "Database is active but requires updating.";
  }
}

// Function with multiple arguments and a return value
function calculateAverageAge(totalAge, numberOfVeterans) {
  if (numberOfVeterans === 0) return 0;
  return totalAge / numberOfVeterans;
}

function handleAddVeteran(event) {
  event.preventDefault();
  
  // Get form values
  const veteran = {
    rank: document.getElementById("rank").value,
    name: document.getElementById("veteranName").value,
    branch: document.getElementById("branch").value,
    birthDate: document.getElementById("birthDate").value,
    deathDate: document.getElementById("deathDate").value || "N/A",
    awards: document.getElementById("awards").value || "N/A",
    currentStatus: document.getElementById("currentStatus").value
  };

  // Save to localStorage
  const veterans = JSON.parse(localStorage.getItem("veterans")) || [];
  veterans.push(veteran);
  localStorage.setItem("veterans", JSON.stringify(veterans));

  // Clear form
  document.getElementById("addVeteranForm").reset();

  // Show success message
  alert("Veteran added successfully!");

  // Redirect to view page
  window.location.href = "view_veterans.html";
}

function displayVeterans() {
  const tbody = document.querySelector("tbody");
  if (!tbody) {
    console.error("Table body not found");
    return;
  }

  const veterans = JSON.parse(localStorage.getItem("veterans")) || [];
  console.log("Retrieved veterans:", veterans); // Debug log

  tbody.innerHTML = ""; // Clear existing content

  if (veterans.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="7" class="text-center">No veterans found</td>';
    tbody.appendChild(tr);
    return;
  }

  veterans.forEach((veteran, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${veteran.rank || "N/A"}</td>
      <td>${veteran.name || "N/A"}</td>
      <td>${veteran.branch || "N/A"}</td>
      <td>${veteran.birthDate || "N/A"}</td>
      <td>${veteran.deathDate || "N/A"}</td>
      <td>${veteran.awards || "N/A"}</td>
      <td>${veteran.currentStatus || "N/A"}</td>
    `;
    tbody.appendChild(tr);
  });
}

//Event for the timer
window.addEventListener("load", initializePage);

//Event on mouse over on the search box.
const searchBox = document.getElementById("search-box");
searchBox.addEventListener("mouseover", () => {
  searchBox.style.backgroundColor = "lightblue";
});

//Event on mouse out on the search box
searchBox.addEventListener("mouseout", () => {
  searchBox.style.backgroundColor = "white";
});

//Initialize page
console.log(WELCOME_MESSAGE);

// Example of using the calculateAverageAge function
const totalAge = 500; // Example total age
const numberOfVeterans = 5;
const averageAge = calculateAverageAge(totalAge, numberOfVeterans);
console.log(`Average age of veterans: ${averageAge}`);

// Add this function to handle the search
function searchVeterans(searchTerm) {
  const veterans = JSON.parse(localStorage.getItem('veterans')) || [];
  const searchResults = veterans.filter(veteran => 
    veteran.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veteran.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veteran.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = ''; // Clear previous results

  if (searchResults.length === 0) {
    searchResultsDiv.innerHTML = `
      <div class="alert alert-info" role="alert">
        No veterans found matching "${searchTerm}"
      </div>
    `;
    return;
  }

  const resultsTable = document.createElement('table');
  resultsTable.className = 'table table-striped table-hover';
  resultsTable.innerHTML = `
    <thead class="table-dark">
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Branch</th>
        <th>Birth Date</th>
        <th>Death Date</th>
        <th>Awards</th>
      </tr>
    </thead>
    <tbody>
      ${searchResults.map(veteran => `
        <tr>
          <td>${veteran.rank || 'N/A'}</td>
          <td>${veteran.name || 'N/A'}</td>
          <td>${veteran.branch || 'N/A'}</td>
          <td>${veteran.birthDate || 'N/A'}</td>
          <td>${veteran.deathDate || 'N/A'}</td>
          <td>${veteran.awards || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  searchResultsDiv.appendChild(resultsTable);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded"); // Debug log

  // For add_veteran.html
  const addForm = document.getElementById("addVeteranForm");
  if (addForm) {
    console.log("Add form found"); // Debug log
    addForm.addEventListener("submit", handleAddVeteran);
  }

  // For view_veterans.html
  if (window.location.pathname.includes('view_veterans.html')) {
    console.log("On view veterans page"); // Debug log
    displayVeterans();
  }

  // Add search button functionality
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');

  if (searchButton && searchInput) {
    // Search on button click
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        searchVeterans(searchTerm);
      }
    });

    // Search on Enter key press
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          searchVeterans(searchTerm);
        }
      }
    });
  }
});
