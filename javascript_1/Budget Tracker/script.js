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
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    if (description && amount > 0) {
        const expense = { description, amount, date: new Date().toLocaleDateString() };
        expenses.push(expense);
        displayExpense(expense);
        updateTotalExpenses();
        localStorage.setItem("expenses", JSON.stringify(expenses));
        descriptionInput.value = '';
        amountInput.value = '';
    } else {
        alert('Please enter a valid description and amount.');
    }
}

// Function to display a single expense in the list with a delete button
function displayExpense(expense) {
    const expenseList = document.getElementById('expenseList');
    if (!expenseList) return;
    const listItem = document.createElement('li');
    listItem.textContent = `${expense.description}: $${expense.amount.toFixed(2)} (Added on: ${expense.date})`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => deleteExpense(expense);

    listItem.appendChild(deleteButton);
    expenseList.appendChild(listItem);
}

// Function to delete an expense
function deleteExpense(expense) {
    expenses = expenses.filter(exp => exp !== expense);
    updateTotalExpenses();
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenseList();
}

// Function to render all expenses
function renderExpenseList() {
    const expenseList = document.getElementById('expenseList');
    if (!expenseList) return;
    expenseList.innerHTML = '';
    expenses.forEach(expense => displayExpense(expense));
}

// Function to update the total expenses
function updateTotalExpenses() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpensesElement = document.getElementById('totalExpenses');
    if (totalExpensesElement) {
        totalExpensesElement.textContent = `$${total.toFixed(2)}`;
    }

    const budgetWarning = document.getElementById('budgetWarning');
    if (budgetWarning) {
        budgetWarning.style.display = (budgetLimit > 0 && total > budgetLimit) ? 'block' : 'none';
    }
}

// Function to display all expenses on summary page
function displayExpenseSummary() {
    const summaryDiv = document.getElementById("expenseListSummary");
    if (!summaryDiv) return;
    summaryDiv.innerHTML = '';
    expenses.forEach(expense => {
        const expenseSummary = document.createElement("div");
        expenseSummary.textContent = `${expense.description}: $${expense.amount.toFixed(2)}`;
        summaryDiv.appendChild(expenseSummary);
    });
}

// Event listener to initialize the page
document.addEventListener("DOMContentLoaded", () => {
    renderExpenseList();
    updateTotalExpenses();
    displayExpenseSummary();
});
