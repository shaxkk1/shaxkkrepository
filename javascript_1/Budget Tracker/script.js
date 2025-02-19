// Configuration object for API endpoints
const apiConfig = {
    baseUrl: 'https://api.example.com',
    endpoints: {
        items: '/items',
        expenses: '/expenses'
    }
};

// Initialize expenses array and budget from localStorage (if available)
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budgetLimit = parseFloat(localStorage.getItem("budgetLimit")) || 0;

// Function to handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    const errorDiv = document.getElementById('apiError');
    if (errorDiv) {
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Function to display API response in a formatted way
function displayApiResponse(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create a collapsible section
    const section = document.createElement('div');
    section.className = 'api-response-section';
    
    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'api-timestamp';
    timestamp.textContent = `Last Updated: ${new Date().toLocaleString()}`;
    
    // Format the response data
    const formattedData = document.createElement('pre');
    formattedData.className = 'api-data';
    formattedData.textContent = JSON.stringify(data, null, 2);
    
    // Assemble the section
    section.appendChild(timestamp);
    section.appendChild(formattedData);
    
    // Clear and update the container
    container.innerHTML = '';
    container.appendChild(section);
}

// Function to fetch data from API with options
async function fetchApiData(endpoint, options = {}) {
    try {
        const response = await fetch(`${apiConfig.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

// Function to set the budget limit
function setBudgetLimit() {
    const budgetInput = document.getElementById('budget');
    budgetLimit = parseFloat(budgetInput.value);
    localStorage.setItem("budgetLimit", budgetLimit);
    updateTotalExpenses();
}

// Function to add a new expense
async function addExpense() {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    if (description && amount > 0) {
        const expense = { description, amount, date: new Date().toLocaleDateString() };
        expenses.push(expense);
        
        // Try to post to API
        try {
            await postExpense(expense);
        } catch (error) {
            console.error('Failed to post expense to API:', error);
            // Continue with local storage even if API fails
        }
        
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
async function deleteExpense(expense) {
    expenses = expenses.filter(exp => exp !== expense);
    updateTotalExpenses();
    localStorage.setItem("expenses", JSON.stringify(expenses));
    
    // Try to sync with API after deletion
    try {
        await syncExpenses();
    } catch (error) {
        console.error('Failed to sync after deletion:', error);
    }
    
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

// Function to get all items from API
async function getItems() {
    try {
        const data = await fetchApiData(apiConfig.endpoints.items);
        displayApiResponse(data, 'apiResponseContainer');
        return data;
    } catch (error) {
        console.error('Error getting items:', error);
        return [];
    }
}

// Function to post new expense to API
async function postExpense(expense) {
    try {
        const data = await fetchApiData(apiConfig.endpoints.expenses, {
            method: 'POST',
            body: JSON.stringify(expense)
        });
        displayApiResponse(data, 'apiResponseContainer');
        return data;
    } catch (error) {
        console.error('Error posting expense:', error);
        return null;
    }
}

// Function to sync local expenses with API
async function syncExpenses() {
    try {
        const response = await fetchApiData(apiConfig.endpoints.expenses, {
            method: 'PUT',
            body: JSON.stringify(expenses)
        });
        displayApiResponse(response, 'apiResponseContainer');
        
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            syncStatus.textContent = 'Last synced: ' + new Date().toLocaleString();
        }
    } catch (error) {
        console.error('Error syncing expenses:', error);
    }
}

// Event listener for when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    renderExpenseList();
    updateTotalExpenses();
    displayExpenseSummary();
    
    // Add sync button functionality if it exists
    const syncButton = document.getElementById('syncButton');
    if (syncButton) {
        syncButton.addEventListener('click', syncExpenses);
    }
    
    // Initial API data fetch
    getItems().then(data => {
        if (data && data.length > 0) {
            displayApiResponse(data, 'apiResponseContainer');
        }
    });
    
    // Display an example user input below the table
    const userExample = {
        "Budget Limit": 10000,
        "Description": "Apple iPhone 11, 64GB",
        "price": 999
    };
    const exampleDetails = document.getElementById("exampleDetails");
    if (exampleDetails) {
        exampleDetails.innerHTML = `<h3>Example User Input:</h3><pre>${JSON.stringify(userExample, null, 2)}</pre>`;
    }
});