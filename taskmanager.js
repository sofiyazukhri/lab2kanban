let tasks = [];
let currentId = 0;
let activeColumnId = 'todo';

const modal = document.getElementById('task-modal');
const addBtns = document.querySelectorAll('.add-task-btn');
const cancelBtn = document.getElementById('cancel-task');
const saveBtn = document.getElementById('save-task');
const taskCounter = document.getElementById('task-counter');
const priorityFilter = document.getElementById('priority-filter');
const clearDoneBtn = document.getElementById('clear-done-btn');

// OPEN MODAL
addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        activeColumnId = btn.getAttribute('data-column');
        modal.removeAttribute('data-editing-id');
        modal.classList.remove('is-hidden');
    });
});

// CLOSE MODAL
cancelBtn.addEventListener('click', () => {
    modal.classList.add('is-hidden');
    clearModalInputs();
});

// CREATE TASK CARD
function createTaskCard(taskObj) {
    const li = document.createElement('li');
    li.setAttribute('data-id', taskObj.id);
    li.classList.add('task-card');

    const title = document.createElement('h3');
    title.textContent = taskObj.title;

    // INLINE EDIT FIXED
    title.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.value = title.textContent;

        li.replaceChild(input, title);
        input.focus();

        const saveEdit = () => {
            const newValue = input.value.trim();

            if (newValue) {
                title.textContent = newValue;

                const task = tasks.find(t => t.id === taskObj.id);
                if (task) task.title = newValue;
            }

            li.replaceChild(title, input);
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveEdit();
        });

        input.addEventListener('blur', saveEdit);
    });

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

// ADD TASK
function addTask(columnId, taskObj) {
    const list = document.querySelector(`#${columnId} .task-list`);
    if (!list) return;

    taskObj.column = columnId;

    const card = createTaskCard(taskObj);
    list.appendChild(card);

    tasks.push(taskObj);

    updateTaskCounter();
}

// SAVE BUTTON
saveBtn.addEventListener('click', () => {
    const editingId = modal.getAttribute('data-editing-id');

    const t = document.getElementById('task-title').value;
    const d = document.getElementById('task-desc').value;
    const p = document.getElementById('task-priority').value;
    const date = document.getElementById('task-date').value;

    if (!t) return alert("Title required");

    const data = { title: t, description: d, priority: p, dueDate: date };

    if (editingId) {
        updateTask(parseInt(editingId), data);
    } else {
        addTask(activeColumnId, { id: ++currentId, ...data });
    }

    modal.classList.add('is-hidden');
    clearModalInputs();
});

// UPDATE TASK 
function updateTask(taskId, updatedData) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    Object.assign(task, updatedData);

    const card = document.querySelector(`[data-id='${taskId}']`);
    if (!card) return;

    card.querySelector('h3').textContent = task.title;
    card.querySelector('p').textContent = task.description;
    card.querySelector('.priority-badge').textContent = task.priority;
    card.querySelector('.priority-badge').className =
        `priority-badge priority-${task.priority}`;
    card.querySelector('small').textContent = `Due: ${task.dueDate}`;
}

// DELETE TASK
function deleteTask(taskId) {
    const card = document.querySelector(`[data-id='${taskId}']`);
    if (!card) return;

    card.classList.add('fade-out');

    card.addEventListener('animationend', () => {
        card.remove();

        tasks = tasks.filter(t => t.id !== taskId);

        updateTaskCounter();
    }, { once: true });
}

// EDIT TASK
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.description;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-date').value = task.dueDate;

    modal.setAttribute('data-editing-id', taskId);
    modal.classList.remove('is-hidden');
}

// EVENT DELEGATION
document.body.addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    const id = parseInt(e.target.getAttribute('data-id'));

    if (action === 'delete') deleteTask(id);
    if (action === 'edit') editTask(id);
});

// FILTER
priorityFilter.addEventListener('change', () => {
    const value = priorityFilter.value;

    document.querySelectorAll('.task-card').forEach(card => {
        const badge = card.querySelector('.priority-badge');
        const match = value === 'all' || badge.textContent === value;

        card.classList.toggle('hidden', !match);
    });
});

// CLEAR DONE 
clearDoneBtn.addEventListener('click', () => {
    const doneCards = document.querySelectorAll('#done .task-card');

    doneCards.forEach(card => {
        card.classList.add('fade-out');

        card.addEventListener('animationend', () => {
            const id = parseInt(card.getAttribute('data-id'));
            card.remove();

            tasks = tasks.filter(t => t.id !== id);

            updateTaskCounter();
        }, { once: true });
    });
});

// COUNTER
function updateTaskCounter() {
    taskCounter.textContent = tasks.length;
}

// CLEAR INPUT
function clearModalInputs() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-date').value = '';
}
