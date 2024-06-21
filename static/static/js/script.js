function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue
}

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll('.nav-tabs a[data-toggle="tab"]');
    function storeActiveTab(tabId) {
        localStorage.setItem('activeTab', tabId);
    }

    function activateStoredTab() {
        const activeTabId = localStorage.getItem('activeTab');
        if (activeTabId) {
            const tabLink = document.querySelector(`.nav-tabs a[href="${activeTabId}"]`);
            if (tabLink) {
                tabLink.click();
            }
        }
    }
    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            storeActiveTab(this.getAttribute('href'));
        });
    });
    activateStoredTab();
});




document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task');
    const tasksContainer = document.getElementById('tasks-container');
    let taskCount = 0;
    let phaseData = {
        phase_name: '',
        phase_deadline: '',
        tasks: []
    };

    // Add new task fields
    addTaskBtn.addEventListener('click', function (e) {
        e.preventDefault();
        taskCount++;

        const taskHTML = `
            <div class="task" id="task-${taskCount}">
                <label>Task nomi:
                    <input type="text" name="tasks[${taskCount}][name]" class="form-control mb-2">
                </label><br>
                <label>Muddat:
                    <input type="date" name="tasks[${taskCount}][deadline]" class="form-control mb-2">
                </label><br>
                <label>Menejer:
                    <input type="text" name="tasks[${taskCount}][manager]" class="form-control mb-2">
                </label>
                <button type="button" class="remove-task" data-task-id="${taskCount}">Remove</button>
                <hr>
            </div>
        `;

        tasksContainer.insertAdjacentHTML('beforeend', taskHTML);
        document.querySelector(`#task-${taskCount} .remove-task`).addEventListener('click', function () {
            const taskId = this.dataset.taskId;
            document.getElementById(`task-${taskId}`).remove();
        });
    });
    document.getElementById('phase-input').addEventListener('input', function () {
        phaseData.phase_name = this.value;
    });
        document.getElementById('phase-deadline').addEventListener('input', function () {
        phaseData.phase_deadline = this.value;
    });
    document.getElementById('save-all-data').addEventListener('click', function () {
        phaseData.tasks = [];
        const taskDivs = document.querySelectorAll('.task');
        taskDivs.forEach(taskDiv => {
            const taskName = taskDiv.querySelector('input[name*="[name]"]').value;
            const taskDeadline = taskDiv.querySelector('input[name*="[deadline]"]').value;
            const taskManager = taskDiv.querySelector('input[name*="[manager]"]').value;

            phaseData.tasks.push({
                name: taskName,
                deadline: taskDeadline,
                manager: taskManager
            });
        });
        var token = getCookie('csrftoken');
        fetch(window.location.href + '/add-phase/',{
            method : "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": token
                    },
                    body: JSON.stringify({'data': phaseData }),
        }).then(res=>{
            location.reload()
        })
    });
});

    var select = document.getElementById('input-select');
    var array = []
    var button = document.getElementById('do-button')
    var confirm_delete = document.getElementById('confirm')
    var delete_button = document.getElementById('delete-button')
    var all_delete_buttons = document.querySelectorAll('.delete-button')
    var delButton = document.getElementById('del-confirm')
    var selectedFiles = document.querySelectorAll('.del-files')
    var delFiles = []


    delButton.addEventListener('click', function () {
        selectedFiles.forEach(file => {
            file.addEventListener('change', function () {
                if (file.checked === true) {
                    delFiles.push(file.id)
                }
                if (file.checked === false) {
                    delFiles = delFiles.filter(item => item !== file.id)
                }
            })


        all_delete_buttons.forEach(value => {
            value.addEventListener('click', function () {
                confirm_delete.addEventListener('click', function () {
                    fetch(`delete/${value.id}`).then(res => {
                        location.reload()
                    })

                })
            })
        })


        document.querySelectorAll("input[type='checkbox']").forEach(value => {
            value.addEventListener('change', function () {
                if (value.checked === true) {
                    console.log(value.id)
                    array.push(value.id)
                }

            })
        })


        delete_button.addEventListener('click', function () {
            for (i = 0; i < array.length; i++) {
                fetch(`delete-user/${array[i]}`).then(res => {
                    console.log(res)
                    location.reload()
                })
            }

        })

        button.addEventListener('click', function () {
            console.log('clicked')
            if (select.value === 'Bloklash') {
                for (i = 0; i < array.length; i++) {
                    fetch(`block/${array[i]}`).then(res => {
                        location.reload()
                    })
                }
            }
            if (select.value === 'Blokdan ochish') {
                for (i = 0; i < array.length; i++) {
                    fetch(`unblock/${array[i]}`).then(res => {
                        location.reload()
                    })
                }
            }
        })
    })
})

document.addEventListener('DOMContentLoaded', function () {
    var trash_id
    document.querySelectorAll('.trash-icon').forEach(value => {
        value.addEventListener('click', function () {
            trash_id = value.id
        })
    })
    document.getElementById('delete-icon-confirm').addEventListener('click', function () {
        fetch(`/projects/my-projects/delete-phase/${trash_id}`).then(res => {
            location.reload()
        })
    })
})

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.chevron').forEach(value => {
        var icon_class
        value.addEventListener('click', function () {
            if (!value.id) {
                icon_class = document.getElementById('chevron' + value.classList[4]).classList
                console.log(icon_class)
            } else {
                icon_class = document.getElementById(value.id).classList
            }

            if (icon_class[1] === 'fa-chevron-right') {
                icon_class.replace('fa-chevron-right', "fa-chevron-down")
            } else {
                icon_class.replace('fa-chevron-down', "fa-chevron-right")
            }
        })
    })
})


document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('icon-buttons')) {
            var phase_id = event.target.classList[3];
            var element = document.getElementById('phase' + phase_id).textContent.toString()
            document.getElementById('phase' + phase_id).innerHTML = `<input type="text" value="${element}"/>`
            document.getElementById('icons-panel' + phase_id).innerHTML = `<i id="icon-save" class="fa-solid fa-circle-check" style="color: green;cursor: pointer"></i>`
                document.getElementById('icon-save').addEventListener('click', function () {
            var new_input = document.getElementById('phase' + phase_id).children.item(0).value
            var token = getCookie('csrftoken')
            fetch(`update-phase/${phase_id}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "X-CSRFToken": token
                },
                body: JSON.stringify({'phase_name': new_input}),


            }).then(res => {
                location.reload()
            })
        })
        }

        document.addEventListener('keypress', function (event) {
            var new_input = document.getElementById('phase' + phase_id).children.item(0).value
            var token = getCookie('csrftoken')
            if (event.key === 'Enter') {
                fetch(`update-phase/${phase_id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": token
                    },
                    body: JSON.stringify({'phase_name': new_input}),


                }).then(res => {
                    location.reload()
                })
            }

        })

    });
});


document.addEventListener('DOMContentLoaded', function () {
    var task_id
    var label
    var label_text
    let task_name = document.getElementById('task-edit-task-name')
    let task_deadline = document.getElementById('task-edit-deadline')
    let task_manager = document.getElementById('task-edit-task-manager')
    document.querySelectorAll('.edit-task-icon').forEach(task => {
        task.addEventListener('click', function () {
            task_id = task.classList[3];
            fetch(`get-task/${task_id}`).then(res=>{
                res.json().then(data=>{
                    let datas = JSON.parse(data)[0].fields
                    task_name.value = datas.task_name
                    task_deadline.value = datas.task_deadline
                    task_manager.value = datas.task_manager

                })
            })
            document.getElementById('confirm-task-update').addEventListener('click',function (){
                let token = getCookie('csrftoken')
                                fetch(`update-task/${task_id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": token
                    },
                    body: JSON.stringify({'task_name': task_name.value,'task_deadline': task_deadline.value,'task_manager': task_manager.value}),


                }).then(res => {
                    location.reload()
                })
            })
        })
    })
})


document.addEventListener('DOMContentLoaded', function () {
    var taskId
    document.querySelectorAll('.delete-task-icon ').forEach(task => {
        task.addEventListener('click', function () {
            taskId = task.id
        })

    })
    document.getElementById('delete-task-confirm').addEventListener('click', function () {
        fetch(`/projects/my-projects/delete-task/${taskId}`).then(res => {
            location.reload()
        })

    })
})


document.addEventListener('DOMContentLoaded', function () {
    var t_id
    document.querySelectorAll('.task-finish').forEach(value => {
        value.addEventListener('click', function () {
            t_id = value.classList[3]
            var percentage = document.getElementById('task-percentage' + t_id).textContent.trim()
            console.log(percentage)
            rangeInput.value = percentage
            label.textContent = `Tugatish foizi : ${percentage}`
        })
    })
    var new_val
        const rangeInput = document.getElementById('task-done');
    const label = document.getElementById('task-done-percentage');

    function updateValue(value) {
        label.textContent = `Tugatish foizi : ${value}`;
        rangeInput.value = value;
    }
   document.getElementById('task-done').addEventListener('change', function (e) {
        let newValue = parseInt(parseInt(e.target.value) / 5)*5;
        if (newValue > 100) {
            newValue = 100;
        }
        new_val = newValue;
        updateValue(newValue);
    });
    document.getElementById('finish-task-confirm').addEventListener('click', function () {
        var token = getCookie('csrftoken')
        fetch(`update-task-percentage/${t_id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "X-CSRFToken": token
            },
            body: JSON.stringify({'task_done_percentage': new_val}),


        }).then(res => {
            location.reload()
        })
    })

})

document.addEventListener('DOMContentLoaded',function (){
    document.getElementById('url-input').style.display = 'none'
    document.getElementById('add-url').addEventListener('click',function (){
        document.getElementById('url-input').style.display = 'block'
    })

    var form = document.getElementById('add-file-form');
    form.addEventListener('submit',function (){
        window.location.replace('/projects/my-projects/detail/')
    })

})

document.addEventListener('DOMContentLoaded',function (){
    var detfiles = document.querySelectorAll('.del-files');
    var datas = []
        document.getElementById('del-confirm').addEventListener('click',function (e){
        location.reload()
    })

    detfiles.forEach(value => {
        value.addEventListener('change',function (e){
            var checked = e.target.checked
            if (checked){
                datas.push(value.id)
            }else {
                datas = datas.filter(item => item !== value.id);
            }
        })
    })



    document.getElementById('del-confirm').addEventListener('click',function (){
                        var token = getCookie('csrftoken')
                fetch(`delete-files/`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": token
                    },
                    body: JSON.stringify({'datas': datas }),


                }).then(res => {
                    location.reload()
                })

    })

})

document.addEventListener('DOMContentLoaded',function (){
      document.getElementById('post-comment').addEventListener('click',function (){
                        var token = getCookie('csrftoken')
        var comment = document.getElementById('comment')
                fetch(`post-comment/${comment.classList[1]}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": token
                    },
                    body: JSON.stringify({'comment': comment.value }),


                }).then(res => {
                   location.reload()
                })

    })
          document.getElementById('post-problem').addEventListener('click',function (){
                        var token = getCookie('csrftoken')
        var comment = document.getElementById('problem')
                fetch(`post-problem/${comment.classList[1]}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": token
                    },
                    body: JSON.stringify({'problem': comment.value }),


                }).then(res => {
                   location.reload()
                })

    })
    document.querySelectorAll('.edit-comment').forEach(value => {
        value.addEventListener('click',function (){
            var c_id = value.classList[4]
            const uuid = crypto.randomUUID()
            var comment = document.getElementById(c_id)
            comment.innerHTML = `<textarea class="form-control" type="text" id="${uuid}">${comment.textContent.trim()}</textarea>`
                                document.addEventListener('keypress',function (e){
                if(e.key === 'Enter'){
                    var token = getCookie('csrftoken')
                    var new_comment = document.getElementById(`${uuid}`)
                                                fetch(`edit-comment/${c_id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": token
                    },
                    body: JSON.stringify({'comment': new_comment.value }),


                }).then(res => {
                   location.reload()
                })
                }

        })
        })

    })
        document.querySelectorAll('.edit-problem').forEach(value => {
        value.addEventListener('click',function (){
            var p_id = value.classList[4]
            const uuid = crypto.randomUUID()
            var problem = document.getElementById(p_id)
            problem.innerHTML = `<textarea class="form-control" type="text" id="${uuid}">${problem.textContent.trim()}</textarea>`
                                document.addEventListener('keypress',function (e){
                if(e.key === 'Enter'){
                    var token = getCookie('csrftoken')
                    var new_problem = document.getElementById(`${uuid}`)
                                                fetch(`edit-problem/${p_id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": token
                    },
                    body: JSON.stringify({'problem': new_problem.value }),


                }).then(res => {
                   location.reload()
                })
                }

        })

        })
                        document.querySelectorAll('.delete-comment').forEach(val => {
                val.addEventListener('click',function (){
                    fetch(`/projects/my-projects/detail/delete-comment/${val.classList[4]}`).then(res=>{
                        location.reload()
                    })
                })
            } )

                                    document.querySelectorAll('.delete-problem').forEach(val => {
                val.addEventListener('click',function (){
                    fetch(`/projects/my-projects/detail/delete-problem/${val.classList[4]}`).then(res=>{
                        location.reload()
                    })
                })
            } )

    })
})




document.addEventListener('DOMContentLoaded', function () {
    var archive_button = document.getElementById('archive');
    var p_id = archive_button.name;
    archive_button.addEventListener('click', function (e) {
        console.log(p_id);
        fetch(`/projects/my-projects/create-archive/${p_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to download archive');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${p_id}.zip`;
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
});

    document.getElementById('filter-table').addEventListener('click',function (){
        var filter = document.getElementById('filter-container');
        if (filter.style.display === 'none'){
            filter.style.display = 'block'
        }else {
            filter.style.display = 'none'
        }
    })



const multiSelectWithoutCtrl = ( elemSelector ) => {
    console.log("Working")
  let options = [].slice.call(document.querySelectorAll(`${elemSelector} option`));
  options.forEach(function (element) {
      element.addEventListener("mousedown",
          function (e) {
              e.preventDefault();
              element.parentElement.focus();
              this.selected = !this.selected;
              return false;
          }, false );
  });
}

document.addEventListener('DOMContentLoaded',function (){
  multiSelectWithoutCtrl('#project_departments')
})