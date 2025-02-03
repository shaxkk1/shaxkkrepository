// Initialize expenses array and budget from localStorage (if available)
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budgetLimit = parseFloat(localStorage.getItem("budgetLimit")) || 0;

// Function to set the budget limit
function setBudgetLimit() {
    const budgetInput = document.getElementById('budget');
    budgetLimit = parseFloat(budgetInput.value);

    // Save the budget limit to localStorage
    localStorage.setItem("budgetLimit", budgetLimit);

    // Update the total expenses to check if we need to show the warning
    updateTotalExpenses();
}

// Function to add a new expense
function addExpense() {
    // Get the input values for description and amount
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    // Validate inputs: description should not be empty and amount should be greater than zero
    if (description && amount > 0) {
        // Create a new expense object
        const expense = { description, amount, date: new Date().toLocaleDateString() };
        
        // Add the expense to the expenses array
        expenses.push(expense);

        // Display the new expense on the page
        displayExpense(expense);
        
        // Update the total expenses value
        updateTotalExpenses();

        // Save the updated expenses array to localStorage
        localStorage.setItem("expenses", JSON.stringify(expenses));

        // Clear the input fields
        descriptionInput.value = '';
        amountInput.value = '';
    } else {
        alert('Please enter a valid description and amount.');
    }
}

// Function to display a single expense in the list with a delete button
function displayExpense(expense) {
    const expenseList = document.getElementById('expenseList');
    const listItem = document.createElement('li');
    listItem.textContent = `${expense.description}: $${expense.amount.toFixed(2)} (Added on: ${expense.date})`;

    // Create delete button for the expense
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => deleteExpense(expense);

    listItem.appendChild(deleteButton);
    expenseList.appendChild(listItem);
}

// Function to delete an expense
function deleteExpense(expense) {
    // Find the index of the expense in the array
    const index = expenses.indexOf(expense);
    if (index > -1) {
        // Remove the expense from the expenses array
        expenses.splice(index, 1);

        // Update the expense list and total expenses
        updateTotalExpenses();
        
        // Save the updated expenses array to localStorage
        localStorage.setItem("expenses", JSON.stringify(expenses));
        
        // Re-render the expense list
        renderExpenseList();
    }
}

// Function to render the entire expense list
function renderExpenseList() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = ''; // Clear the current list

    // Re-display all expenses
    expenses.forEach(expense => displayExpense(expense));
}

// Function to update and display the total expenses
function updateTotalExpenses() {
    // Calculate the total expenses using reduce method
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpensesElement = document.getElementById('totalExpenses');

    if (totalExpensesElement) {
        totalExpensesElement.textContent = `$${total.toFixed(2)}`;
    }

    // Display warning if expenses exceed the budget limit
    const budgetWarning = document.getElementById('budgetWarning');
    if (budgetLimit > 0 && total > budgetLimit) {
        budgetWarning.style.display = 'block';
    } else {
        budgetWarning.style.display = 'none';
    }
}

// Function to display all expenses in the summary page
function displayExpenseSummary() {
    const summaryDiv = document.getElementById("expenseListSummary");
    
    // Clear previous summary
    summaryDiv.innerHTML = ''; 

    // Loop through the expenses and display each in the summary section
    expenses.forEach(expense => {
        const expenseSummary = document.createElement("div");
        expenseSummary.textContent = `${expense.description}: $${expense.amount.toFixed(2)}`;
        summaryDiv.appendChild(expenseSummary);
    });
}

// Event listener to handle DOMContentLoaded and initialize the page
document.addEventListener("DOMContentLoaded", () => {
    // Update the total expenses if we're on the index page
    if (document.getElementById("totalExpenses")) {
        updateTotalExpenses();
    }

    // Display expense summary if we're on the summary page
    if (document.getElementById("expenseListSummary")) {
        displayExpenseSummary();
    }
});

// Function to display a single expense in the list with a delete button
function displayExpense(expense) {
    const expenseList = document.getElementById('expenseList');
    const listItem = document.createElement('li');
    listItem.textContent = `${expense.description}: $${expense.amount.toFixed(2)} (Added on: ${expense.date})`;

    // Create delete button for the expense
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => deleteExpense(expense);

    // Add the delete button to the list item
    listItem.appendChild(deleteButton);

    // Append the list item to the expense list
    expenseList.appendChild(listItem);
}
