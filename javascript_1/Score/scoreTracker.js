// Centralized JavaScript management - All code is in this file.

// Utilize descriptive variable names
let totalScore = 75; // integer value representing a score
let passingScore = 50; // integer value representing the passing score

// Integrate distinct data types
let isPassed = totalScore >= passingScore; // boolean to check if the score meets passing score

// Implement mathematical operations
let bonusPoints = 10;
let finalScore = totalScore + bonusPoints; // perform a mathematical operation (addition)

// Create decision making with decision structures
if (isPassed) {
    console.log("You passed the exam!");
    document.getElementById("result").innerText = "You passed the exam!";
} else {
    console.log("You failed the exam.");
    document.getElementById("result").innerText = "You failed the exam.";
}

// Utilize logical operators for complex condition evaluation
if (totalScore >= passingScore && finalScore > 80) {
    console.log("Great job! You passed with a good score.");
    document.getElementById("result").innerText = "Great job! You passed with a good score.";
} else if (totalScore < passingScore || finalScore <= 80) {
    console.log("You passed, but you can improve your score.");
    document.getElementById("result").innerText = "You passed, but you can improve your score.";
}

// Showcase JavaScript Output Techniques
// Output is printed to both the console and displayed on the webpage using DOM
console.log("Final Score: " + finalScore);
document.getElementById("result").innerText += ` Your final score is ${finalScore}.`;
