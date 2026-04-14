const modal = document.getElementById('task-modal');
const addBtns = document.querySelectorAll('.add-task-btn');
const cancelBtn = document.getElementById('cancel-task');

// Open modal
addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.remove('is-hidden');
    });
});

// Close modal
cancelBtn.addEventListener('click', () => {
    modal.classList.add('is-hidden');
});


