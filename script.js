let tasks = [];
let currentFilter = "all";

// ========== 抓網頁元素 ==========
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const totalCount = document.getElementById("total-count");
const activeCount = document.getElementById("active-count");
const completedCount = document.getElementById("completed-count");

// ========== 依照 tasks，把清單畫到畫面上 ==========
function renderTasks() {
  taskList.innerHTML = "";
  
  // 任務篩選
  const visibleTasks = tasks.filter(function (task) {
    if (currentFilter === "active") {
      return !task.completed;
    }
    if (currentFilter === "completed") {
      return task.completed;
    }
    return true;
  });  
  
  visibleTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "task-" + task.id;
    checkbox.checked = task.completed;

    // 打勾或取消勾選時切換狀態
    checkbox.addEventListener("change", function () {
      task.completed = !task.completed;
      renderTasks();
    });

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = task.text;

    // 刪除任務
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "刪除";

    deleteBtn.addEventListener("click", function () {
      tasks = tasks.filter(function (t) {
        return t.id !== task.id;
      });
      renderTasks();
    });

    li.append(checkbox, label, deleteBtn);
    taskList.appendChild(li);
  });

  updateStats();
}

// ========== 新增任務 ==========
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  // 沒有輸入內容就不新增
  if (text === "") {
    alert("請輸入任務名稱");
    return;
  }

  tasks.push({ id: Date.now(), text: text, completed: false });

  taskInput.value = "";
  renderTasks();
});

// ========== 篩選任務 ==========
filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;
 
    filterBtns.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
 
    renderTasks();
  });
});

// ========== 更新統計資料 ==========
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;
  const active = total - completed;
 
  totalCount.textContent = total;
  activeCount.textContent = active;
  completedCount.textContent = completed;
}

renderTasks();
