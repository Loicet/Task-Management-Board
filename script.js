// Sample Tasks

let tasks = [
    { id: 1, name: "Complete homework", date: "2025-09-30", category: "myday", status: "pending" }
    { id: 2, name: "Grocery shopping", date: "2025-10-01", category: "planned", status: "pending" },
    { id: 3, name: "Finish project", date: "2025-10-05", category: "important", status: "completed" },
    { id: 4, name: "Doctor appointment", date: "2025-10-02", category: "planned", status: "pending" },
    { id: 5, name: "Team meeting", date: "2025-10-03", category: "shared", status: "completed" }
];

let currentCategory = "all";

const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const categoryTitle = document.getElementById("currentCategory");

// Modal elements
const taskModal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModal = document.getElementById("closeModal");
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskDate = document.getElementById("taskDate");

// Show Tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filtered = tasks.filter(t => currentCategory === "all" || t.category === currentCategory);

    filtered.forEach(task => {
        let div = document.createElement("div");
        div.className = `flex justify-between items-center p-3 rounded shadow 
      ${task.status === "completed" ? "bg-green-100 dark:bg-green-700 line-through" : "bg-gray-100 dark:bg-gray-700"}`;

        div.innerHTML = `
      <div>
        <h3 class="font-semibold">${task.name}</h3>
        <p class="text-sm text-gray-500">Due: ${task.date}</p>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleStatus(${task.id})" class="bg-blue-500 text-white px-2 py-1 rounded text-xs">${task.status === "pending" ? "Complete" : "Undo"}</button>
        <button onclick="deleteTask(${task.id})" class="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
      </div>
    `;
        taskList.appendChild(div);
    });

    updateProgress(filtered);
    updateCounts();
}

// Progress Bar
function updateProgress(list) {
    let total = list.length;
    let completed = list.filter(t => t.status === "completed").length;
    let percent = total === 0 ? 0 : (completed / total) * 100;

    progressBar.style.width = percent + "%";
    progressText.textContent = `${completed} of ${total} tasks completed`;
}

// Update counts in sidebar
function updateCounts() {
    const categories = ["myday", "important", "planned", "shared"];
    categories.forEach(cat => {
        document.getElementById(`count-${cat}`).textContent = tasks.filter(t => t.category === cat).length;
    });
    document.getElementById("count-all").textContent = tasks.length;
}
// Toggle Complete / Incomplete
function toggleStatus(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, status: t.status === "pending" ? "completed" : "pending" } : t);
    saveTasks();
    renderTasks();
}
// Delete Task
function deleteTask(id) {
    if (confirm("Delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Add New Task
taskForm.addEventListener("submit", e => {
    e.preventDefault();

    if (taskName.value.trim() === "") {
        alert("Task name cannot be empty");
        return;
    }

    const newTask = {
        id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        name: taskName.value.trim(),
        date: taskDate.value,
        category: currentCategory === "all" ? "myday" : currentCategory,
        status: "pending"
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
    taskModal.style.display = "none";
});

// Modal Controls
addTaskBtn.addEventListener("click", () => taskModal.classList.remove("hidden"));
closeModal.addEventListener("click", () => taskModal.classList.add("hidden"));

// Sidebar Navigation
document.querySelectorAll(".navBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentCategory = btn.dataset.category;
        categoryTitle.textContent = btn.textContent.trim();
        renderTasks();
    });
});

// Save & Load from localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) tasks = JSON.parse(saved);
}

// Theme Toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});

// Initialize
loadTasks();
renderTasks();