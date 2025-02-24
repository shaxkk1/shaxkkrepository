document.addEventListener("DOMContentLoaded", () => {
    console.log("Camping Tips site loaded.");
  
    let greetingMessage = "Ready for your next adventure?";
    let currentHour = new Date().getHours();
    let isMorning = currentHour < 12;
  
    if (isMorning) {
      greetingMessage = "Good morning, camper!";
    } else {
      greetingMessage = "Good afternoon, camper!";
    }
  
    // Example of mathematical operation
    let hoursUntilNoon = isMorning ? 12 - currentHour : 0; 
  
    // Logical operator example
    if (isMorning && hoursUntilNoon < 3) {
      greetingMessage += " Almost noon!";
    }
  
    // Displaying output in both console and webpage
    console.log(`Current Hour: ${currentHour}, Hours until noon: ${hoursUntilNoon}`);
    document.body.insertAdjacentHTML("beforeend", `<p>${greetingMessage}</p>`);
  });
  