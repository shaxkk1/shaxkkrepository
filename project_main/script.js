// Constants for reliability
const currentYear = new Date().getFullYear();
const BASE_VETERAN_COUNT = 5;
const WELCOME_MESSAGE = "Welcome to the Bethel Cemetery Veteran Database!";

// Variables
let updateInterval;
// Descriptive array
const militaryBranches = ["Army", "Navy", "Air Force", "Marines", "Coast Guard"];

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

function handleAddVeteran() {
  const name = document.getElementById("veteranName").value;
  const branch = document.getElementById("branch").value;
  const rank = document.getElementById("rank").value;
  const birthDate = document.getElementById("birthDate").value;
  const deathDate = document.getElementById("deathDate").value;
  const awards = document.getElementById("awards").value;
  const currentStatus = document.getElementById("currentStatus").value;

  const veteran = {
    name,
    branch,
    rank,
    birthDate,
    deathDate,
    awards,
    currentStatus
  };
  console.log("New veteran added:", veteran);
  saveVeteranToLocalStorage(veteran);
}
function saveVeteranToLocalStorage(veteran) {
  const veterans = JSON.parse(localStorage.getItem("veterans")) || [];
  veterans.push(veteran);
  localStorage.setItem("veterans", JSON.stringify(veterans));
}
function displayVeterans() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  const veterans = JSON.parse(localStorage.getItem("veterans")) || [];
  veterans.forEach((veteran) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${veteran.rank || ""}</td>
                      <td>${veteran.name}</td>
                      <td>${veteran.branch}</td>
                      <td>${veteran.birthDate || ""}</td>
                      <td>${veteran.deathDate || ""}</td>
                      <td>${veteran.awards || ""}</td>
                      <td>${veteran.currentStatus}</td>`;

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

//Event on mouse click on the add button
document.getElementById("addButton").addEventListener("click", handleAddVeteran);
