const modal = document.getElementById('task-modal');
const addBtns = document.querySelectorAll('.add-task-btn');
const cancelBtn = document.getElementById('cancel-task');
const saveBtn = document.getElementById('save-task');
const taskCounter = document.getElementById('task-counter');
let tasks = [];
let currentId = 0;
let activeColumnId = 'todo'; 

// Open modal
addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        activeColumnId = btn.getAttribute('data-column');
        modal.classList.remove('is-hidden');
    });
});

// Close modal
cancelBtn.addEventListener('click', () => {
    modal.classList.add('is-hidden');
    clearModalInputs();
});

//task card element
function createTaskCard(taskObj) {
    const li = document.createElement('li');
    li.setAttribute('data-id', taskObj.id);
    li.classList.add('task-card');

    const title = document.createElement('h3');
    title.textContent = taskObj.title;

    const desc = document.createElement('p');
    desc.textContent = taskObj.description;

    const badge = document.createElement('span');
    badge.textContent = taskObj.priority;
    badge.classList.add('priority-badge', `priority-${taskObj.priority}`);

    const date = document.createElement('small');
    date.textContent = `Due: ${taskObj.dueDate}`;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', taskObj.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('data-id', taskObj.id);

    li.append(title, desc, badge, date, editBtn, deleteBtn);
    return li;
}

//add task
function addTask(columnId, taskObj) {
    const columnList = document.querySelector(`#${columnId} .task-list`);
    const card = createTaskCard(taskObj);
    columnList.appendChild(card);
    
    tasks.push(taskObj);
    updateTaskCounter();
}

//delete task
function deleteTask(taskId) {
    const card = document.querySelector(`[data-id="${taskId}"]`);
    if (card) {
        card.classList.add('fade-out');
        card.addEventListener('animationend', () => {
            card.remove();
            tasks = tasks.filter(t => t.id !== taskId);
            updateTaskCounter();
        });
    }
}

saveBtn.addEventListener('click', () => {
    const titleVal = document.getElementById('task-title').value;
    const descVal = document.getElementById('task-desc').value;
    const priorityVal = document.getElementById('task-priority').value;
    const dateVal = document.getElementById('task-date').value;

    if (!titleVal) return alert("Please enter a title");

    const newTask = {
        id: ++currentId,
        title: titleVal,
        description: descVal,
        priority: priorityVal,
        dueDate: dateVal
    };

    addTask(activeColumnId, newTask);
    modal.classList.add('is-hidden');
    clearModalInputs();
});

//update task counter
function updateTaskCounter() {
    taskCounter.textContent = tasks.length;
}

function clearModalInputs() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-date').value = '';
}
