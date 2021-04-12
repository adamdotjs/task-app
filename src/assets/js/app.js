//***********************
// GLOBAL VARIABLES
//***********************

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let userName = localStorage.getItem("userName") || "";

const input = document.querySelector("#new-item");
const inputForm = document.querySelector(".task-input");
const intro = document.querySelector(".intro");
const tasksContainer = document.querySelector(".task-list");
const resetBtn = document.querySelector(".btn--clear");

//***********************
// DEFINE FUNCTIONS
//***********************

// Add name to header
function generateName(result) {
  userName = result;
  localStorage.setItem("userName", result);
}

// Render name to DOM & change hidden status to show or hide forms
function renderName(userName) {
  const appTitle = document.querySelector("h1");

  if (userName) {
    inputForm.classList.toggle("hidden");
    intro.classList.toggle("hidden");
    appTitle.textContent = `${userName}'s To Do List`;
    tasksContainer.classList.toggle("hidden");
    resetBtn.classList.toggle("hidden");
  }
}

// Add new task to tasks array
function generateTask(newTask) {
  let task = {
    id: Date.now(),
    item: newTask,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    status: "open",
  };
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks to DOM
function renderTasks() {
  if (!tasks.length) {
    tasksContainer.innerHTML = `<h2>You have nothing to do!</h2>`;
  } else {
    tasksContainer.innerHTML = tasks
      .map((task) => {
        return `
        <li class="task-item flow ${task.status}" data-id="${task.id}">
          <div>
            <p class="item">${task.item}</p>
            <p class="date">Created on ${task.date} at ${task.time}</p>
          </div>
          <div class="task-actions">
            <button class="btn--delete"><i class="far fa-trash-alt"></i></button>
            <button class="btn--complete"><i class="fas fa-check"></i></button>
            <button class="btn--edit"><i class="fas fa-edit"></i></button>
            <button class="btn--priority"><i class="fas fa-exclamation"></i></button>
          </div>
        </li>
      `;
      })
      .join("");
  }
}

// Change task status depending on button click
function handleStatus(target) {
  const targetParent = target.parentElement.parentElement;

  tasks.forEach((task) => {
    if (task.id == targetParent.getAttribute("data-id")) {
      if (target.classList.contains("btn--priority")) {
        task.status === "priority"
          ? (task.status = "open")
          : (task.status = "priority");
        targetParent.classList.toggle("priority");
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      } else if (target.classList.contains("btn--complete")) {
        task.status = "complete";
        targetParent.classList.toggle("complete");
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      } else if (target.classList.contains("btn--delete")) {
        const index = tasks.indexOf(task);
        targetParent.remove();
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      } else if (target.classList.contains("btn--edit")) {
        const taskText = targetParent.querySelector(".item");
        taskText.toggleAttribute("contenteditable");
        taskText.classList.toggle("editable");
        task.item = taskText.textContent;
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Prevent line breaks by toggling editability if enter key is pressed
        // Seems like an ugly way to handle it, not sure of better option.
        window.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            taskText.removeAttribute("contenteditable");
            taskText.classList.remove("editable");
            task.item = taskText.textContent;
            localStorage.setItem("tasks", JSON.stringify(tasks));
          }
        });
      }
    }
  });
}

// Filter tasks by status
function filterTasks(filterValue) {
  const tasksList = document.querySelectorAll(".task-item");

  tasksList.forEach((task) => {
    switch (filterValue) {
      case "all":
        task.classList.remove("hidden");
        break;
      case "open":
        if (task.classList.contains("open")) {
          task.classList.remove("hidden");
        } else {
          task.classList.add("hidden");
        }
        break;
      case "complete":
        if (task.classList.contains("complete")) {
          task.classList.remove("hidden");
        } else {
          task.classList.add("hidden");
        }
        break;
      case "priority":
        if (task.classList.contains("priority")) {
          task.classList.remove("hidden");
        } else {
          task.classList.add("hidden");
        }
        break;
    }
  });
}

//***********************
// GLOBAL INVOKATIONS
//***********************

renderName(userName);
renderTasks();

//***********************
// EVENT HANDLERS
//***********************

// Handle name
intro.addEventListener("submit", (e) => {
  const nameInput = document.querySelector("#name");
  e.preventDefault();
  generateName(nameInput.value.trim());
  renderName(nameInput.value.trim());
});

// Handle new tasks
inputForm.addEventListener("submit", (e) => {
  const taskInput = document.querySelector("#new-item");

  e.preventDefault();
  generateTask(taskInput.value.trim());
  renderTasks();
  taskInput.value = "";

  if (document.querySelector("#filter").value != "all") {
    filterTasks("open");
    document.querySelector("#filter").value = "open";
  }
});

// Handle status
document.querySelector(".task-list").addEventListener("click", (e) => {
  handleStatus(e.target);
  filterTasks(document.querySelector("#filter").value);
});

// Handle Filters
document.querySelector("#filter").addEventListener("change", (e) => {
  filterTasks(e.target.value);
});

// Reset local storage to clear list & name
resetBtn.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
