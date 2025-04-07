// Import columns from veteran data lists
var branchList = getColumn("Veterans Database", "Military Branch");
var rankList = getColumn("Veterans Database", "Rank");
var firstNameList = getColumn("Veterans Database", "First Name");
var lastNameList = getColumn("Veterans Database", "Last Name");
var serviceYearsList = getColumn("Veterans Database", "Years of Service");
var conflictList = getColumn("Veterans Database", "Conflict/War");

// Create blank lists to filter data
var filteredRankList = [];
var filteredFirstNameList = [];
var filteredLastNameList = [];
var filteredServiceYearsList = [];
var filteredConflictList = [];

// Saves the user's text input
var userInput = "";

// Event handler for the "homeButton" click event
onEvent("homeButton", "click", function() {
  setScreen("veteranFinderScreen"); // Change screen to the veteran finder screen
  // Clear text content of specific elements
  setText("branchInput", "");
  setText("serviceYearsOutput", "");
  setText("lastNameOutput", "");
  setText("firstNameOutput", "");
  setText("rankOutput", "");
  setText("conflictOutput", "");
  userInput = ""; // Reset user input variable
  // Empty arrays for filtering
  filteredRankList = [];
  filteredFirstNameList = [];
  filteredLastNameList = [];
  filteredServiceYearsList = [];
  filteredConflictList = [];
});

// Event handler for the "searchButton" click event
onEvent("searchButton", "click", function() {
  userInput = getText("branchInput"); // Get the user input from the "branchInput" element
  filterData(userInput); // Call the filterData function to filter the data based on the user input
  updateScreen(userInput); // Update the screen with the filtered data
});

// Function to create filtered lists based on the user input branch
function filterData(branch) {
  // Clear the existing filtered lists
  filteredRankList = [];
  filteredFirstNameList = [];
  filteredLastNameList = [];
  filteredServiceYearsList = [];
  filteredConflictList = [];
  
  // Loop through the branchList to find matches for the user input and populate the filtered lists
  for (var i = 0; i < branchList.length; i++) {
    if (branchList[i] == branch) {
      appendItem(filteredRankList, rankList[i]);
      appendItem(filteredFirstNameList, firstNameList[i]);
      appendItem(filteredLastNameList, lastNameList[i]);
      appendItem(filteredServiceYearsList, serviceYearsList[i]);
      appendItem(filteredConflictList, conflictList[i]);
    }
  }
  setScreen("veteranInformationScreen"); // Set the screen to "veteranInformationScreen"
}

// Function to update the text on the veteranInformation screen
function updateScreen() {
  for (var i = 0; i < branchList.length; i++) {
    // Check if the filtered lists have data to display, then update the screen elements
    if ((filteredRankList && (filteredFirstNameList && filteredLastNameList) + (filteredServiceYearsList && filteredConflictList)) != "") {
      setProperty("rankOutput", "text", "Rank: " + filteredRankList.join(", "));
      setProperty("firstNameOutput", "text", "First Name: " + filteredFirstNameList.join(", "));
      setProperty("lastNameOutput", "text", "Last Name: " + filteredLastNameList.join(", "));
      setProperty("serviceYearsOutput", "text", "Years of Service: " + filteredServiceYearsList.join(", "));
      setProperty("conflictOutput", "text", "Conflict/War: " + filteredConflictList.join(", "));
    } else {
      // If no data is found for the user input branch, display a message saying that no information is recorded.
      setText("rankOutput", "No information recorded. Try another military branch.");
      setText("firstNameOutput", "No information recorded. Try another military branch.");
      setText("lastNameOutput", "No information recorded. Try another military branch.");
      setText("serviceYearsOutput", "No information recorded. Try another military branch.");
      setText("conflictOutput", "No information recorded. Try another military branch.");
    }
  }
}