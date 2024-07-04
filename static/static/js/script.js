
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


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('archive-btn').addEventListener('click',function (){
    let p_id = document.getElementById('archive-btn').getAttribute('p_id')
    downloadArchive(p_id)
})
    document.querySelectorAll('.p-files').forEach(value => {
        value.addEventListener('click',function (){
          downloadFile(value.id)
        })
    })
    problemsManager();
    commentsManager();
    deleteFiles();
    change_table();
    initTabs();
    initTaskManager();
    initPhaseActions();
    initTaskEdit();
    initTaskDelete();
    initTaskCompletion();
    initCommentSystem();
    initFilterToggle();
    initMultiSelect();
});

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

function deleteFiles() {
    let delFiles = [];
    const all_delete_buttons = document.querySelectorAll('.delete-button');
    const selectedFiles = document.querySelectorAll('.del-files');
    selectedFiles.forEach(file => {
        file.addEventListener('change', function () {
            if (file.checked === true) {
                delFiles.push(file.id);
            } else {
                delFiles = delFiles.filter(item => item !== file.id);
            }
        });
    });
    document.getElementById('del-confirm').addEventListener('click', function () {
        sendPostRequest('delete-files/', {'datas': delFiles})
        location.reload()
    });
}



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
        location.reload()
    };

    addTaskBtn.addEventListener('click', addTask);
    document.getElementById('phase-input').addEventListener('input', (e) => phaseData.phase_name = e.target.value);
    document.getElementById('phase-deadline').addEventListener('input', (e) => phaseData.phase_deadline = e.target.value);
    document.getElementById('save-all-data').addEventListener('click', savePhaseData);
}


function initPhaseActions() {
    let phaseId = null;
    document.querySelectorAll('.trash-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            phaseId = icon.id;
        });
    });

    document.getElementById('delete-icon-confirm').addEventListener('click', function () {
        fetch(`/projects/my-projects/delete-phase/${phaseId}`).then(() => location.reload());
    });

    document.querySelectorAll('.icon-buttons').forEach(value => {
        value.addEventListener('click', function () {
            let phaseId = value.classList[3];
            const el = document.getElementById(`phase${phaseId}`);
            console.log(el)
            let element = el.textContent.trim();
            document.getElementById(`phase${phaseId}`).innerHTML = `<input type="text" value="${element}"/>`;
            document.getElementById(`icons-panel${phaseId}`).innerHTML = `<i id="icon-save" class="fa-solid fa-circle-check" style="color: green;cursor: pointer"></i>`;

            document.getElementById('icon-save').addEventListener('click', function () {
                const newInput = document.getElementById(`phase${phaseId}`).children.item(0).value;
                sendPostRequest(`update-phase/${phaseId}`, {phase_name: newInput});
                location.reload()
            });
        })
    })


}

function problemsManager() {
    let edit_problems = document.querySelectorAll('.edit-problem ');
    let delete_problems = document.querySelectorAll('.delete-problem');
    var problem
    edit_problems.forEach(value => {
        value.addEventListener('click', function () {
            problem = document.getElementById(value.classList[4]);
            problem.innerHTML = `<textarea type="text" id="area${problem.id}"> ${problem.textContent.trim()} </textarea>`;

            document.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    sendPostRequest(`edit-problem/${problem.id}`, {'problem': problem.firstChild.value})
                    problem.innerHTML = `${problem.firstChild.value}`
                    problem = null
                }
            })
        })

    })
    delete_problems.forEach(value => {
        value.addEventListener('click', function () {
            var problem_id = value.classList[4]
            console.log(problem_id)
            document.getElementById('confirm-delete-problem').addEventListener('click', function () {
                fetch(`delete-problem/${problem_id}`).then(res => {
                    location.reload()
                })
            })

        })
    })
}

function commentsManager() {
    let delete_comments = document.querySelectorAll('.delete-comment');
    let edit_comments = document.querySelectorAll('.edit-comment ');
    var comment
    edit_comments.forEach(value => {
        value.addEventListener('click', function () {
            comment = document.getElementById(value.classList[4]);
            comment.innerHTML = `<textarea type="text" id="area${comment.id}"> ${comment.textContent.trim()} </textarea>`;

            document.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    sendPostRequest(`edit-comment/${comment.id}`, {'comment': comment.firstChild.value})
                    comment.innerHTML = `${comment.firstChild.value}`
                    comment = null
                }
            })
        })

    })
    delete_comments.forEach(value => {
        value.addEventListener('click', function () {
            var comment_id = value.classList[4]
            document.getElementById('confirm-delete-comment').addEventListener('click', function () {
                fetch(`delete-comment/${comment_id}`).then(res => {
                    location.reload()
                })
            })

        })
    })
}


function initTaskEdit() {
    const taskName = document.getElementById('task-edit-task-name');
    const taskDeadline = document.getElementById('task-edit-deadline');
    const taskManager = document.getElementById('task-edit-task-manager');

    document.querySelectorAll('.edit-task-icon').forEach(task => {
        task.addEventListener('click', function () {
            const taskId = task.classList[3];
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
                location.reload()
            });
        });
    });
}


function initTaskDelete() {
    let taskId = null;

    document.querySelectorAll('.delete-task-icon').forEach(task => {
        task.addEventListener('click', function () {
            taskId = task.id;
        });
    });

    document.getElementById('delete-task-confirm').addEventListener('click', function () {
        fetch(`/projects/my-projects/delete-task/${taskId}`).then(() => location.reload());
    });
}

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
        location.reload()
    });
}


function initCommentSystem() {
    document.getElementById('problem-btn').addEventListener('click', function () {
        const problem = document.getElementById('problem');
        const taskId = problem.classList[1];
        sendPostRequest(`post-problem/${taskId}`, {'problem': problem.value});
        location.reload()
    });

    document.getElementById('comment-btn').addEventListener('click', function () {
        const comment = document.getElementById('comment');
        const taskId = comment.classList[1];
        sendPostRequest(`post-comment/${taskId}`, {'comment': comment.value});
        location.reload()
    });
}




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


function initMultiSelect() {
    document.querySelectorAll('.multi-select').forEach(select => {
        select.addEventListener('change', function () {
            const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
            const taskId = this.classList[1];
            sendPostRequest(`update-multi/${taskId}`, {selected: selectedOptions});
            location.reload()
        });
    });
}


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
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    const csrfToken = getCookie('csrftoken');

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
                    location.reload();
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert('No items selected.');
        }
    }

    document.getElementById('do-button').addEventListener('click', function () {
        const action = document.getElementById('input-select').value;
        if (action === 'block') handleBulkAction('users/view/block');
        else if (action === 'unblock') handleBulkAction('users/view/unblock');
    });

    document.getElementById('delete-button').addEventListener('click', function () {
        if (confirm("Chindan ham bu foydalanuvchini o'chirasizmi ?")) {
            handleBulkAction('users/view/delete-user');
        }
    });

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

function add_listeners() {
    var delete_expense_modal = document.getElementById('delete-expense-btn');
    var e_id
    document.querySelectorAll('.delete-expense').forEach(value => {
        value.addEventListener('click', function () {
            e_id = value.id

        })
    })
    var delete_expense_btn = document.getElementById('confirm-delete-expense-btn');
    delete_expense_btn.addEventListener('click', function () {
        fetch(`delete-expense/${e_id}}`).then(res => {
            var child = document.getElementById(e_id);
            if (child) {
                var parent = child.closest('tr');
                if (parent) {
                    parent.remove()
                    res.json().then(response => {
                        var total = response.spent_money
                        var left = response.total_money.replaceAll(' ', '') - response.spent_money.replaceAll(' ', '')
                        document.getElementById('totalExpenses').textContent = `${formatNumber(total)}`
                        document.getElementById('budgetLeft').textContent = `${formatNumber(left)}`
                        delete_expense_modal.classList.remove('show');
                        delete_expense_modal.style.display = 'none';
                        document.body.classList.remove('modal-open');
                        document.querySelector('.modal-backdrop').remove();
                    })
                }
            }
        })
    })
}

function change_table() {
    console.log('table working')
    document.querySelectorAll('.change-table').forEach(value => {
        value.addEventListener('change', function (e) {
            let selectedId = value.selectedOptions[0].id;
            if (selectedId === 'blog') {
                document.querySelectorAll('.d_datas').forEach(el => el.style.display = 'none')
                document.querySelectorAll('.b_datas').forEach(el => el.style.display = '')
                document.getElementById('table-title').innerText = 'Loyihalar boklar kesimida'

            }

            if (selectedId === 'dept') {
                document.querySelectorAll('.d_datas').forEach(el => el.style.display = '')
                document.querySelectorAll('.b_datas').forEach(el => el.style.display = 'none')
                document.getElementById('table-title').innerText = 'Loyihalar departamentlar kesimida'
            }
        })
    })
}



document.getElementById('add-expense').addEventListener('submit', function (e) {
    e.preventDefault()
    let expense = document.getElementById('expense').value
    let amount = document.getElementById('amount').value
    let date = document.getElementById('date').value
    let p_id = e.target.classList[0];
    let file = document.getElementById('file')
    var input_file
    if (file.files[0]) {
        input_file = file.files[0]
    }
    let csrfToken = getCookie('csrftoken')
    let formData = new FormData()
    let data = {'expense': expense, 'amount': amount, 'date': date, 'file': file.files[0]}
    formData.append('file', input_file)
    formData.append('data', JSON.stringify(data))
    if (expense) {
        console.log(input_file)
        fetch(`add-expense/${p_id}`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: formData,
        }).then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    console.log(response)
                    let tbody = document.getElementById('expenses-body')
                    tbody.innerHTML = `${tbody.innerHTML} <tr class="text-center"><td class="text-center">${expense}</td><td class="text-center">${amount}</td><td class="text-center">${date}</td> <td class="text-center"><i style="color: red;cursor: pointer" id="${response.id}" data-toggle="modal" data-target="#delete-expense-btn" class="fa-regular delete-expense fa-trash-can text-center"></i></td></tr><div id="delete-expense-btn"
                                                                                         class="modal fade"
                                                                                         tabindex="-1" role="dialog"
                                                                                         aria-hidden="true">
                                                                                        <div class="modal-dialog modal-sm modal-dialog-centered"
                                                                                             role="document">
                                                                                            <div class="modal-content">
                                                                                                <div class="modal-body text-center">
                                                                                                    <i class="fa-solid fa-triangle-exclamation btn-lg" style="font-size: 5dvh"></i>
                                                                                                    <h4>Chindan o'chirasizmi ?</h4></div>
                                                                                                <div class="d-flex justify-content-center mb-2">
                                                                                                    <button id="confirm-delete-expense-btn" class="btn btn-danger mr-2"><i class="fa-solid fa-trash-can"></i> O'chirish</button>
                                                                                                    <button class="btn btn-secondary" data-dismiss="modal">Bekor qilish</button>
                                                                                                    <br>
                                                                                                </div>
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>`
                    add_listeners()
                    var total = response.spent_money
                    var left = response.total_money.replaceAll(' ', '') - response.spent_money.replaceAll(' ', '')
                    document.getElementById('totalExpenses').textContent = `${formatNumber(total)}`
                    document.getElementById('budgetLeft').textContent = `${formatNumber(left)}`
                })
            } else {
                alert("error occured")
            }
        })
    }
})

function downloadArchive(pk) {
    $.ajax({
        type: 'GET',
        url: `create-archive/${pk}`,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        },
        xhrFields: {
            responseType: 'blob'
        },
        success: function(data) {
            var a = document.createElement('a');
            a.style = 'display: none';
            document.body.appendChild(a);
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = `${pk}.zip`;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        error: function(xhr, status, error) {
            console.error('Error downloading archive:', error);
        }
    });
}

        function downloadFile(documentId) {
            const downloadUrl = `download-file/${documentId}`;

            fetch(downloadUrl)
                .then(response => {
                    if (response.ok) {
                        const contentDisposition = response.headers.get('Content-Disposition');
                        const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'downloaded_file';
                        return response.blob().then(blob => ({ filename, blob }));
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(({ filename, blob }) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }

document.getElementById('dropdownMenuButton').addEventListener('mouseover',function (){
    document.getElementById('dropdown-menu').classList.add('show')
})