const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

window.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    loadTasks();
});

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

function addTask() {
    const taskText = input.value.trim();
    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    createTask(taskText);
    saveAndRender();
    input.value = "";
    input.focus();
}

function createTask(taskText, completed = false) {
    const li = document.createElement("li");
    if (completed) {
        li.classList.add("completed");
    }

    const taskLabel = document.createElement("label");
    taskLabel.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed", checkbox.checked);
        saveAndRender();
    });

    const taskTextSpan = document.createElement("span");
    taskTextSpan.textContent = taskText;

    taskLabel.appendChild(checkbox);
    taskLabel.appendChild(taskTextSpan);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
        list.removeChild(li);
        saveAndRender();
    });

    li.appendChild(taskLabel);
    li.appendChild(removeBtn);
    list.appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        const text = li.querySelector(".task-label span").textContent;
        const completed = li.querySelector(".task-checkbox").checked;
        tasks.push({ text, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function sortTasks(tasks) {
    return tasks.slice().sort((a, b) => a.completed - b.completed);
}

function renderTasks(tasks) {
    list.innerHTML = "";
    tasks.forEach(task => createTask(task.text, task.completed));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks(sortTasks(tasks));
}

function saveAndRender() {
    saveTasks();
    loadTasks();
}

function loadTheme() {
    const storedTheme = localStorage.getItem("theme") || "light";
    const isDark = storedTheme === "dark";
    document.body.classList.toggle("dark-theme", isDark);
    themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}
