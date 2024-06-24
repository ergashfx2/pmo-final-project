// Utility to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie.startsWith(`${name}=`)) {
                cookieValue = decodeURIComponent(trimmedCookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    initTabs();
    initTaskManager();
    initBulkActions();
    initPhaseActions();
    initTaskEdit();
    initTaskDelete();
    initTaskCompletion();
    initCommentSystem();
    initArchive();
    initFilterToggle();
    initMultiSelect();
});

// Initialize tabs with stored state
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tabs a[data-toggle="tab"]');
    const storeActiveTab = (tabId) => localStorage.setItem('activeTab', tabId);

    const activateStoredTab = () => {
        const activeTabId = localStorage.getItem('activeTab');
        if (activeTabId) {
            const tabLink = document.querySelector(`.nav-tabs a[href="${activeTabId}"]`);
            if (tabLink) tabLink.click();
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            storeActiveTab(this.getAttribute('href'));
        });
    });

    activateStoredTab();
}

// Initialize task manager for adding and removing tasks
function initTaskManager() {
    const addTaskBtn = document.getElementById('add-task');
    const tasksContainer = document.getElementById('tasks-container');
    let taskCount = 0;
    const phaseData = {phase_name: '', phase_deadline: '', tasks: []};

    const createTaskHTML = (id) => `
        <div class="task" id="task-${id}">
            <label>Task Name:
                <input type="text" name="tasks[${id}][name]" class="form-control mb-2">
            </label><br>
            <label>Deadline:
                <input type="date" name="tasks[${id}][deadline]" class="form-control mb-2">
            </label><br>
            <label>Manager:
                <input type="text" name="tasks[${id}][manager]" class="form-control mb-2">
            </label>
            <button type="button" class="remove-task" data-task-id="${id}">Remove</button>
            <hr>
        </div>
    `;

    const addTask = () => {
        taskCount++;
        tasksContainer.insertAdjacentHTML('beforeend', createTaskHTML(taskCount));
        document.querySelector(`#task-${taskCount} .remove-task`).addEventListener('click', function () {
            document.getElementById(`task-${this.dataset.taskId}`).remove();
        });
    };

    const savePhaseData = () => {
        phaseData.tasks = [];
        document.querySelectorAll('.task').forEach(taskDiv => {
            const taskName = taskDiv.querySelector('input[name*="[name]"]').value;
            const taskDeadline = taskDiv.querySelector('input[name*="[deadline]"]').value;
            const taskManager = taskDiv.querySelector('input[name*="[manager]"]').value;
            phaseData.tasks.push({name: taskName, deadline: taskDeadline, manager: taskManager});
        });
        sendPostRequest(`${window.location.href}/add-phase/`, {data: phaseData});
    };

    addTaskBtn.addEventListener('click', addTask);
    document.getElementById('phase-input').addEventListener('input', (e) => phaseData.phase_name = e.target.value);
    document.getElementById('phase-deadline').addEventListener('input', (e) => phaseData.phase_deadline = e.target.value);
    document.getElementById('save-all-data').addEventListener('click', savePhaseData);
}

// Initialize bulk actions for blocking, unblocking, and deleting users
function initBulkActions() {
    const select = document.getElementById('input-select');
    const button = document.getElementById('do-button');
    const deleteButton = document.getElementById('delete-button');
    const confirmDelete = document.getElementById('confirm');
    let selectedItems = [];

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) selectedItems.push(this.id);
            else selectedItems = selectedItems.filter(id => id !== this.id);
        });
    });

    const performAction = (action) => {
        alert("working")
        selectedItems.forEach(id => {
            fetch(`/${action}/${id}`).then(() => location.reload());
        });
    };

    button.addEventListener('click', function () {
        if (select.value === 'Block') performAction('block');
        if (select.value === 'Unblock') performAction('unblock');
    });

    deleteButton.addEventListener('click', () => performAction('delete-user'));
    confirmDelete.addEventListener('click', () => performAction('delete'));
}

// Initialize phase actions for editing and deleting
function initPhaseActions() {
    let phaseId = null;

    document.querySelectorAll('.trash-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            phaseId = this.id;
        });
    });

    document.getElementById('delete-icon-confirm').addEventListener('click', function () {
        fetch(`/projects/my-projects/delete-phase/${phaseId}`).then(() => location.reload());
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('icon-buttons')) {
            phaseId = event.target.classList[3];
            const element = document.getElementById(`phase${phaseId}`).textContent.trim();
            document.getElementById(`phase${phaseId}`).innerHTML = `<input type="text" value="${element}"/>`;
            document.getElementById(`icons-panel${phaseId}`).innerHTML = `<i id="icon-save" class="fa-solid fa-circle-check" style="color: green;cursor: pointer"></i>`;

            document.getElementById('icon-save').addEventListener('click', function () {
                const newInput = document.getElementById(`phase${phaseId}`).children.item(0).value;
                sendPostRequest(`update-phase/${phaseId}`, {phase_name: newInput});
            });
        }
    });
}

// Initialize task edit functionality
function initTaskEdit() {
    const taskName = document.getElementById('task-edit-task-name');
    const taskDeadline = document.getElementById('task-edit-deadline');
    const taskManager = document.getElementById('task-edit-task-manager');

    document.querySelectorAll('.edit-task-icon').forEach(task => {
        task.addEventListener('click', function () {
            const taskId = this.classList[3];
            fetch(`get-task/${taskId}`).then(res => res.json()).then(data => {
                const taskData = JSON.parse(data)[0].fields;
                taskName.value = taskData.task_name;
                taskDeadline.value = taskData.task_deadline;
                taskManager.value = taskData.task_manager;
            });

            document.getElementById('confirm-task-update').addEventListener('click', function () {
                const updatedData = {
                    task_name: taskName.value,
                    task_deadline: taskDeadline.value,
                    task_manager: taskManager.value
                };
                sendPostRequest(`update-task/${taskId}`, updatedData);
            });
        });
    });
}

// Initialize task delete functionality
function initTaskDelete() {
    let taskId = null;

    document.querySelectorAll('.delete-task-icon').forEach(task => {
        task.addEventListener('click', function () {
            taskId = this.id;
        });
    });

    document.getElementById('delete-task-confirm').addEventListener('click', function () {
        fetch(`/projects/my-projects/delete-task/${taskId}`).then(() => location.reload());
    });
}

// Initialize task completion functionality
function initTaskCompletion() {
    const rangeInput = document.getElementById('task-done');
    const label = document.getElementById('task-done-percentage');
    let taskId = null;
    let newVal = 0;

    const updateValue = (value) => {
        label.textContent = `Completion Percentage: ${value}%`;
        rangeInput.value = value;
    };

    document.querySelectorAll('.task-finish').forEach(button => {
        button.addEventListener('click', function () {
            taskId = this.classList[3];
            const percentage = parseInt(document.getElementById(`task-percentage${taskId}`).textContent.trim());
            updateValue(percentage);
        });
    });

    rangeInput.addEventListener('change', function (e) {
        newVal = Math.min(Math.round(e.target.value / 5) * 5, 100);
        updateValue(newVal);
    });

    document.getElementById('finish-task-confirm').addEventListener('click', function () {
        sendPostRequest(`update-task-percentage/${taskId}`, {task_done_percentage: newVal});
    });
}

// Initialize comment and problem management system
function initCommentSystem() {
    document.getElementById('problem-btn').addEventListener('click', function () {
        const problem = document.getElementById('problem').value;
        const taskId = this.classList[1];
        sendPostRequest(`add-problem/${taskId}`, {problem});
    });

    document.getElementById('comment-btn').addEventListener('click', function () {
        const comment = document.getElementById('comment').value;
        const taskId = this.classList[1];
        sendPostRequest(`add-comment/${taskId}`, {comment});
    });
}

// Initialize archive functionality
function initArchive() {
    document.querySelectorAll('.archive-btn').forEach(button => {
        button.addEventListener('click', function () {
            const phaseId = this.id;
            fetch(`archive-phase/${phaseId}`).then(() => location.reload());
        });
    });

    document.querySelectorAll('.unarchive-btn').forEach(button => {
        button.addEventListener('click', function () {
            const phaseId = this.id;
            fetch(`unarchive-phase/${phaseId}`).then(() => location.reload());
        });
    });
}

// Initialize filter toggle functionality
function initFilterToggle() {
    document.getElementById('filter').addEventListener('click', function () {
        const filterArea = document.getElementById('filter-area');
        if (filterArea.style.display === 'none' || !filterArea.style.display) {
            filterArea.style.display = 'block';
        } else {
            filterArea.style.display = 'none';
        }
    });
}

// Initialize multi-select functionality
function initMultiSelect() {
    document.querySelectorAll('.multi-select').forEach(select => {
        select.addEventListener('change', function () {
            const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
            const taskId = this.classList[1];
            sendPostRequest(`update-multi/${taskId}`, {selected: selectedOptions});
        });
    });
}

// Send POST request utility
function sendPostRequest(url, data) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            location.reload();
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    const csrfToken = getCookie('csrftoken');

    // Get CSRF token from cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const trimmedCookie = cookie.trim();
                if (trimmedCookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(trimmedCookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Handle bulk actions
    function handleBulkAction(action) {
        const selectedIds = Array.from(document.querySelectorAll('.form-check-input:checked'))
            .map(checkbox => checkbox.value);
        if (selectedIds.length > 0) {
            Promise.all(selectedIds.map(id => {
                return fetch(`/${action}/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            location.reload()
                        }
                    });
            }))
                .then(() => {
                    location.reload();  // Reload the page after all actions are completed
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert('No items selected.');
        }
    }

    // Event listener for the Go button
    document.getElementById('do-button').addEventListener('click', function () {
        const action = document.getElementById('input-select').value;
        if (action === 'block') handleBulkAction('users/view/block');
        else if (action === 'unblock') handleBulkAction('users/view/unblock');
    });

    // Event listener for the Delete button
    document.getElementById('delete-button').addEventListener('click', function () {
        if (confirm("Chindan ham bu foydalanuvchini o'chirasizmi ?")) {
            handleBulkAction('users/view/delete-user');
        }
    });

    // Select all checkbox
    document.getElementById('select-all').addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('.form-check-input');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
});
function formatNumber(val) {
    val = parseInt(val);
    let formatted = val.toLocaleString();

    formatted = formatted.replace(/,/g, ' ');

    return formatted;
}
function add_listeners(){
 document.querySelectorAll('.delete-expense').forEach(value => {
    let e_id = value.id
    value.addEventListener('click',function (){
        fetch(`delete-expense/${e_id}}`).then(res=>{
            var child = document.getElementById(e_id);
            if (child){
                var parent = child.closest('tr');
                if (parent){
                    parent.remove()
                    res.json().then(response=>{
                        var total = response.spent_money
                var left = response.total_money.replaceAll(' ','') - response.spent_money.replaceAll(' ','')
                document.getElementById('totalExpenses').textContent = `${formatNumber(total)}`
                document.getElementById('budgetLeft').textContent = `${formatNumber(left)}`
                    })
                }
            }
        })
    })
})
}

add_listeners()

document.getElementById('add-expense').addEventListener('submit', function (e) {
    e.preventDefault()
    let expense = document.getElementById('expense').value
    let amount = document.getElementById('amount').value
    let date = document.getElementById('date').value
    let p_id = e.target.classList[0];
    console.log(p_id)
    let csrfToken = getCookie('csrftoken')
    fetch(`add-expense/${p_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({'expense': expense, 'amount': amount, 'date': date}),
    }).then(res => {
        if (res.status === 200) {
            res.json().then(response => {
                let tbody = document.getElementById('expenses-body')
                tbody.innerHTML = `${tbody.innerHTML} <tr><td>${expense}</td><td>${amount}</td><td>${date}</td> <td><i style="color: red;cursor: pointer" id="${response.id}" class="fa-regular delete-expense fa-trash-can"></i></td></tr>`
                add_listeners()
                var total = response.spent_money
                var left = response.total_money.replaceAll(' ','') - response.spent_money.replaceAll(' ','')
                document.getElementById('totalExpenses').textContent = `${formatNumber(total)}`
                document.getElementById('budgetLeft').textContent = `${formatNumber(left)}`
            })
        } else {
            alert("error occured")
        }
    })
})
