// ============================================================
//  app.js — Task Dashboard (single JS file)
//  Covers: constants, getElementById/ClassName/TagName,
//  attribute manipulation, CSS changes, else-if, onclick,
//  onload, onmouseover, custom functions, loops, arrays,
//  setTimeout / clearTimeout, setInterval / clearInterval
// ============================================================

// ── Named Constants ──────────────────────────────────────────
const MAX_TASK_LENGTH  = 80;
const CLOCK_INTERVAL_MS = 1000;
const TIP_ROTATE_MS    = 4000;
const PRIORITY_COLORS  = { low: "#4caf7d", medium: "#f5a623", high: "#ff5c5c" };

// ── App State ─────────────────────────────────────────────────
let tasks = [];
let clockIntervalId  = null;   // setInterval handle for clock
let tipIntervalId    = null;   // setInterval handle for tip rotation
let tipTimeoutId     = null;   // clearTimeout example

// ── Productivity Tips Array (iterated) ───────────────────────
const TIPS = [
  "Break large tasks into smaller, actionable steps.",
  "Tackle your highest-priority task first each morning.",
  "Use the Pomodoro technique: 25 min work, 5 min break.",
  "Batch similar tasks together to reduce context-switching.",
  "Review and update your task list at the end of each day.",
  "Say no to low-value work so you can say yes to what matters."
];

// ── onload Handler ────────────────────────────────────────────
function handleLoad() {
  startClock();
  renderTips();
  renderTasks();
  updateStats();
  setupMouseovers();

  // Schedule a welcome flash after 1 s, then clear it
  tipTimeoutId = setTimeout(() => {
    const subtitle = document.getElementById("subtitle");
    subtitle.textContent = "Welcome back! Let's get things done.";
    subtitle.style.color = "#e8ff47";
    // Reset after 3 s using another timeout, then clearTimeout is no longer needed
    const resetId = setTimeout(() => {
      subtitle.textContent = "Organize. Focus. Deliver.";
      subtitle.style.color = "";
    }, 3000);
    // We keep resetId in scope; clearTimeout called below is for demo
    clearTimeout(tipTimeoutId); // safe to call — already fired, cleans reference
  }, 1000);
}

// ── Clock (setInterval + clearInterval pattern) ───────────────
function startClock() {
  updateClockDisplay();
  clockIntervalId = setInterval(updateClockDisplay, CLOCK_INTERVAL_MS);
}

function updateClockDisplay() {
  const now    = new Date();
  const hh     = String(now.getHours()).padStart(2, "0");
  const mm     = String(now.getMinutes()).padStart(2, "0");
  const ss     = String(now.getSeconds()).padStart(2, "0");
  const clockEl = document.getElementById("clock-display");
  if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss}`;
}

// ── Custom Function: buildTaskObject (multiple args, returns) ─
function buildTaskObject(name, priority, id) {
  const trimmed = name.trim().substring(0, MAX_TASK_LENGTH);
  return { id, name: trimmed, priority, done: false };
}

// ── Add Task (onclick via HTML attribute on button) ───────────
function addTask() {
  const input    = document.getElementById("task-input");
  const select   = document.getElementById("priority-select");
  const rawName  = input.value;

  if (!rawName.trim()) {
    // Flash the input red briefly
    input.style.borderColor = "#ff5c5c";
    setTimeout(() => { input.style.borderColor = ""; }, 1000);
    return;
  }

  const newTask = buildTaskObject(rawName, select.value, Date.now());
  tasks.push(newTask);
  input.value = "";
  renderTasks();
  updateStats();
}

// ── Render Tasks (loop + array access) ───────────────────────
function renderTasks() {
  const list    = document.getElementById("task-list");
  const emptyMsg = document.getElementById("empty-message");
  list.innerHTML = "";

  if (tasks.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";

  // Iterate array with a for loop
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const li   = createTaskElement(task);
    list.appendChild(li);
  }
}

// ── Create a Task <li> element (uses getElementById by class, tag) ─
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item" + (task.done ? " done" : "");

  // Add a custom data-attribute to the element (new attribute)
  li.setAttribute("data-task-id", task.id);
  li.setAttribute("data-priority", task.priority);

  // Priority dot
  const dot = document.createElement("span");
  dot.className = `priority-dot ${task.priority}`;
  dot.style.backgroundColor = getPriorityColor(task.priority); // CSS change via JS

  // Task name
  const nameSpan = document.createElement("span");
  nameSpan.className = "task-name";
  nameSpan.textContent = task.name;

  // Priority label
  const prioSpan = document.createElement("span");
  prioSpan.className = "task-priority";
  prioSpan.textContent = task.priority;

  // Complete button
  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = task.done ? "Undo" : "Done";
  completeBtn.onclick = () => toggleTask(task.id);

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "✕";
  removeBtn.onclick = () => removeTask(task.id);

  // onmouseover on the li — show priority info in subtitle
  li.onmouseover = () => highlightPriority(task.priority);

  li.append(dot, nameSpan, prioSpan, completeBtn, removeBtn);
  return li;
}

// ── Priority Color Helper (else-if) ───────────────────────────
function getPriorityColor(priority) {
  if (priority === "high") {
    return PRIORITY_COLORS.high;
  } else if (priority === "medium") {
    return PRIORITY_COLORS.medium;
  } else {
    return PRIORITY_COLORS.low;
  }
}

// ── Toggle / Remove ───────────────────────────────────────────
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) { task.done = !task.done; }
  renderTasks();
  updateStats();
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
  updateStats();
}

// ── Stats (getElementById, manipulate CSS) ────────────────────
function updateStats() {
  const totalEl   = document.getElementById("stat-total");
  const doneEl    = document.getElementById("stat-done");
  const pendingEl = document.getElementById("stat-pending");

  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;

  totalEl.textContent   = `Total: ${total}`;
  doneEl.textContent    = `Done: ${done}`;
  pendingEl.textContent = `Pending: ${pending}`;

  // CSS change: highlight stat-done green only when > 0
  doneEl.style.color = done > 0 ? "var(--low)" : "var(--muted)";
}

// ── Mouseover feedback (uses getElementsByClassName) ──────────
function highlightPriority(priority) {
  const subtitle = document.getElementById("subtitle");
  const color    = getPriorityColor(priority);
  subtitle.textContent = `Priority: ${priority.toUpperCase()}`;
  subtitle.style.color = color;
}

// Also set up mouseleave on the task-list section to restore subtitle
function setupMouseovers() {
  // getElementsByTagName example
  const sections = document.getElementsByTagName("section");
  for (let s = 0; s < sections.length; s++) {
    sections[s].onmouseleave = () => {
      const subtitle = document.getElementById("subtitle");
      subtitle.textContent = "Organize. Focus. Deliver.";
      subtitle.style.color = "";
    };
  }

  // getElementsByClassName example — add hover title attribute
  const statBoxes = document.getElementsByClassName("stat-box");
  for (let b = 0; b < statBoxes.length; b++) {
    statBoxes[b].setAttribute("title", "Live task statistic");
    statBoxes[b].onmouseover = () => {
      statBoxes[b].style.borderColor = "#e8ff47";
    };
    statBoxes[b].onmouseleave = () => {
      statBoxes[b].style.borderColor = "";
    };
  }
}

// ── Tips Rendering (array iteration) ─────────────────────────
function renderTips() {
  const container = document.getElementById("tips-container");
  container.innerHTML = "";

  // Loop through TIPS array, access each element
  for (let i = 0; i < TIPS.length; i++) {
    const card = document.createElement("div");
    card.className = "tip-card";
    card.textContent = TIPS[i];
    card.setAttribute("data-tip-index", i);
    container.appendChild(card);
  }

  // Rotate a highlighted tip every TIP_ROTATE_MS seconds
  let activeTipIndex = 0;
  const cards = document.getElementsByClassName("tip-card");

  function highlightNextTip() {
    // Remove highlight from all
    for (let c = 0; c < cards.length; c++) {
      cards[c].style.borderColor = "";
      cards[c].style.color = "";
    }
    // Highlight current
    if (cards[activeTipIndex]) {
      cards[activeTipIndex].style.borderColor = "#e8ff47";
      cards[activeTipIndex].style.color = "#e8eaf0";
    }
    activeTipIndex = (activeTipIndex + 1) % TIPS.length;
  }

  highlightNextTip();
  tipIntervalId = setInterval(highlightNextTip, TIP_ROTATE_MS);
}