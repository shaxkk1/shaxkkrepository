document.addEventListener("DOMContentLoaded", () => {
  const productTable = document.getElementById("product-table");
  const productTableBody = productTable.querySelector("tbody");

  const products = [
      {
          id: "1",
          name: "Google Pixel 6 Pro",
          data: {
              color: "Cloudy White",
              Capacity: "128 GB"
          }
      },
      {
          id: "2",
          name: "Apple iPhone 12 Mini, 256GB, Blue",
          data: null
      },
      {
          id: "3",
          name: "Apple iPhone 12 Pro Max",
          data: {
              color: "Cloudy White",
              Capacity: "512 GB"
          }
      },
      {
          id: "4",
          name: "Apple iPhone 11, 64GB",
          data: {
              price: 389.99,
              color: "Purple"
          }
      },
      {
          id: "5",
          name: "Samsung Galaxy Z Fold2",
          data: {
              price: 689.99,
              color: "Brown"
          }
      }
  ];

  function renderProductDetails(data) {
      if (!data) return "No additional data";
      return Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
  }

  function populateTable() {
      products.forEach((product) => {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
              <td>${product.id}</td>
              <td>${product.name}</td>
              <td>${renderProductDetails(product.data)}</td>
          `;
          productTableBody.appendChild(newRow);
      });
  }

  populateTable();

  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskTable = document.getElementById("task-table");
  const taskTableBody = taskTable.querySelector("tbody");
  let taskCount = 0;

  function addTask(taskDescription) {
      taskCount++;
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
          <td>Task ${taskCount}</td>
          <td>${taskDescription}</td>
          <td>
              <input type="checkbox" id="task-${taskCount}" onchange="toggleTask(this)">
              <label for="task-${taskCount}">Mark as completed</label>
          </td>
      `;
      taskTableBody.appendChild(newRow);
  }

  taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskDescription = taskInput.value.trim();
      if (taskDescription) {
          addTask(taskDescription);
          taskInput.value = "";
      }
  });

  function toggleTask(checkbox) {
      const row = checkbox.closest("tr");
      const taskDescription = row.cells[1];
      if (checkbox.checked) {
          taskDescription.classList.add("completed");
      } else {
          taskDescription.classList.remove("completed");
      }
  }
});
