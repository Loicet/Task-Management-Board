// Sample Tasks
let tasks = [
    { id: 1, name: "Complete homework", date: "2025-09-30", category: "myday", status: "pending" },
    { id: 2, name: "Grocery shopping", date: "2025-10-01", category: "planned", status: "pending" },
    { id: 3, name: "Finish project", date: "2025-10-05", category: "important", status: "completed" },
    { id: 4, name: "Doctor appointment", date: "2025-10-02", category: "planned", status: "pending" },
    { id: 5, name: "Team meeting", date: "2025-10-03", category: "shared", status: "completed" }
];

let currentCategory = "all";
let currentFilter = "all";

// Move everything inside DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const taskList = document.getElementById("taskList");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const categoryTitle = document.getElementById("currentCategory");
    const taskForm = document.getElementById("taskForm");
    const taskName = document.getElementById("taskName");
    const taskDate = document.getElementById("taskDate");

    // Format date
    function formatDate(dateString) {
        if (!dateString) return "No due date";
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return "Tomorrow";
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    }

    // Check if task is overdue
    function isOverdue(dateString) {
        if (!dateString) return false;
        const taskDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate < today;
    }

    // Show Tasks
    function renderTasks() {
        let filtered = tasks.filter(t => currentCategory === "all" || t.category === currentCategory);

        // Apply status filter
        if (currentFilter !== "all") {
            filtered = filtered.filter(t => t.status === currentFilter);
        }

        taskList.innerHTML = "";

        if (filtered.length === 0) {
            const emptyState = document.createElement("div");
            emptyState.className = "text-center text-brown/60 py-12";
            emptyState.innerHTML = `
                <div class="text-6xl mb-4">${getCategoryEmoji(currentCategory)}</div>
                <p class="text-lg font-medium mb-2">No ${currentFilter === "all" ? "" : currentFilter} tasks in ${currentCategory === "all" ? "your list" : currentCategory}</p>
                <p class="text-sm text-brown/40">Add a new task to get started!</p>
            `;
            taskList.appendChild(emptyState);
        } else {
            filtered.forEach(task => {
                const div = document.createElement("div");
                const overdue = task.status === "pending" && isOverdue(task.date);

                div.className = `group relative p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${task.status === "completed"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50 opacity-75"
                        : overdue
                            ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50"
                            : "bg-gradient-to-r from-white to-cream/30 border-brown/20 hover:border-brown/40"
                    }`;

                div.innerHTML = `
                    <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="text-lg">${getCategoryEmoji(task.category)}</span>
                                <h3 class="font-semibold text-brown text-lg ${task.status === "completed" ? "line-through opacity-60" : ""} truncate">${task.name}</h3>
                                ${task.status === "completed" ? '<span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">✓ Done</span>' : ''}
                                ${overdue ? '<span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">⚠️ Overdue</span>' : ''}
                            </div>
                            <div class="flex flex-wrap items-center gap-3 text-sm text-brown/70">
                                <span class="flex items-center gap-1">
                                    <span></span>
                                    <span class="${overdue ? "text-red-600 font-semibold" : ""}">${formatDate(task.date)}</span>
                                </span>
                                <span class="bg-brown/10 text-brown/80 px-2 py-1 rounded-full text-xs font-medium capitalize">
                                    ${task.category.replace('myday', 'my day')}
                                </span>
                            </div>
                        </div>
                        <div class="flex gap-2 self-start">
                            <button 
                                class="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${task.status === "pending"
                        ? "bg-rose-900 hover:bg-rose-900 text-white"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }"
                                data-action="toggle" data-id="${task.id}"
                            >
                                ${task.status === "pending" ? "✓ Complete" : "↺ Undo"}
                            </button>
                                  <button 
                                class="px-5 py-2 bg-cyan-600 hover:bg-cyan-600 text-white rounded-xl text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                data-action="edit" data-id="${task.id}"
                            >
                                 Edit
                            </button>
                            <button 
                                class="px-3 py-2 bg-red-600 hover:bg-red-600 text-white rounded-xl text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                data-action="delete" data-id="${task.id}"
                            >
                                 Delete
                            </button>
                        </div>
                    </div>
                `;
                taskList.appendChild(div);
            });
        }

        updateProgress();
        updateCounts();
    }

    // Progress Bar
    function updateProgress() {
        const allTasks = currentCategory === "all" ? tasks : tasks.filter(t => t.category === currentCategory);
        const total = allTasks.length;
        const completed = allTasks.filter(t => t.status === "completed").length;
        const percent = total === 0 ? 0 : (completed / total) * 100;

        progressBar.style.width = percent + "%";
        progressText.textContent = `${completed} of ${total} tasks completed`;

        // Add completion celebration
        if (percent === 100 && total > 0) {
            progressText.textContent += " ";
            progressBar.classList.add("animate-pulse");
        } else {
            progressBar.classList.remove("animate-pulse");
        }
    }

    // Update counts in sidebar
    function updateCounts() {
        const categories = ["myday", "important", "planned", "shared"];
        categories.forEach(cat => {
            const count = tasks.filter(t => t.category === cat).length;
            const el = document.getElementById(`count-${cat}`);
            if (el) el.textContent = count;
        });
        const allEl = document.getElementById("count-all");
        if (allEl) allEl.textContent = tasks.length;
    }

    // Toggle Complete / Incomplete
    function toggleStatus(id) {
        tasks = tasks.map(t => t.id === id ? {
            ...t,
            status: t.status === "pending" ? "completed" : "pending"
        } : t);
        saveTasks();
        renderTasks();

        // Add some visual feedback
        const task = tasks.find(t => t.id === id);
        if (task && task.status === "completed") {
            showNotification("Task completed! ", "success");
        }
    }

    // Delete Task
    function deleteTask(id) {
        if (confirm("Are you sure you want to delete this task?")) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
            showNotification("Task deleted", "info");
        }
    }

    // Add New Task
    if (taskForm) {
        taskForm.addEventListener("submit", e => {
            e.preventDefault();

            if (taskName.value.trim() === "") {
                showNotification("Please enter a task name", "error");
                taskName.focus();
                return;
            }

            const newTask = {
                id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                name: taskName.value.trim(),
                date: taskDate.value || null,
                category: currentCategory === "all" ? "myday" : currentCategory,
                status: "pending"
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskForm.reset();
            showNotification("Task added successfully! ", "success");
        });
    }

    // Show notification
    function showNotification(message, type = "info") {
        const notification = document.createElement("div");
        const colors = {
            success: "bg-green-500",
            error: "bg-red-500",
            info: "bg-blue-500"
        };

        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg z-50 transform translate-x-full transition-transform duration-300 font-medium`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove("translate-x-full");
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.classList.add("translate-x-full");
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Sidebar Navigation
    document.querySelectorAll(".navBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active state from all buttons
            document.querySelectorAll(".navBtn").forEach(b => {
                b.classList.remove("bg-white/80", "shadow-lg", "border-brown/40", "scale-105");
            });

            // Add active state to clicked button
            btn.classList.add("bg-white/80", "shadow-lg", "border-brown/40", "scale-105");

            currentCategory = btn.dataset.category;
            const categoryText = btn.querySelector("span:last-child").textContent.trim();
            categoryTitle.textContent = categoryText;
            renderTasks();
        });
    });

    // Filter buttons
    document.querySelectorAll(".filterBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active state from all filter buttons
            document.querySelectorAll(".filterBtn").forEach(b => {
                b.classList.remove("bg-brown", "text-white", "shadow-lg");
                b.classList.add("bg-cream/50", "hover:bg-brown");
            });

            // Add active state to clicked button
            btn.classList.remove("bg-cream/50", "hover:bg-brown");
            btn.classList.add("bg-brown", "text-white", "shadow-lg");

            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Save & Load from localStorage
    function saveTasks() {
        localStorage.setItem("taskManagerTasks", JSON.stringify(tasks));
        localStorage.setItem("taskManagerTheme", document.documentElement.classList.contains("dark") ? "dark" : "light");
    }

    function loadTasks() {
        const saved = localStorage.getItem("taskManagerTasks");
        if (saved) {
            try {
                tasks = JSON.parse(saved);
            } catch (e) {
                console.error("Error loading tasks:", e);
            }
        }

        const savedTheme = localStorage.getItem("taskManagerTheme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        }
    }

    // Theme Toggle
    const toggleThemeBtn = document.getElementById("toggleTheme");
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark");
            saveTasks();

            const isDark = document.documentElement.classList.contains("dark");
            showNotification(`Switched to ${isDark ? "dark" : "light"} theme`, "info");
        });
    }

    // Set today's date as default
    if (taskDate) {
        const today = new Date().toISOString().split('T')[0];
        taskDate.value = today;
    }

    // Set initial active state for "All Tasks" button
    const allNavBtn = document.querySelector('.navBtn[data-category="all"]');
    if (allNavBtn) allNavBtn.classList.add("bg-white/80", "shadow-lg", "border-brown/40", "scale-105");

    // Set initial active state for "All" filter
    const allFilterBtn = document.querySelector('.filterBtn[data-filter="all"]');
    if (allFilterBtn) {
        allFilterBtn.classList.remove("bg-cream/50");
        allFilterBtn.classList.add("bg-brown", "text-white", "shadow-lg");
    }

    // Handle task actions (toggle, delete) using event delegation
    taskList.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        const id = parseInt(btn.getAttribute("data-id"));
        if (btn.getAttribute("data-action") === "toggle") {
            toggleStatus(id);
        } else if (btn.getAttribute("data-action") === "delete") {
            deleteTask(id);
        }
        else if (btn.getAttribute("data-action") === "edit") {
            editTask(id);
        }
    });

    function editTask(id) {
        const t = tasks.find(t => t.id === id);
        const newTaskName = prompt("Enter your new task", t.name);
        const newDate = prompt("Enter new date", t.date);

        if (newTaskName) {
            t.name = newTaskName;
        }
       if (newDate){
        t.date = newDate
       }
        renderTasks();
    }


    // Auto-save when page unloads
    window.addEventListener("beforeunload", saveTasks);

    // Initialize
    loadTasks();
    renderTasks();
});

// Helper: getCategoryEmoji (add this if not present)
function getCategoryEmoji(category) {
    switch (category) {
        case "myday": return "";
        case "important": return "";
        case "planned": return "";
        case "shared": return "";
        default: return "";
    }
}

