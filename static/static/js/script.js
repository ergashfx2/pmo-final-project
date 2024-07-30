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


var click_to_close = false
document.addEventListener('click', function (e) {
    document.querySelectorAll('.post-comment').forEach(value => {
        if (click_to_close === true) {
            if (!e.target.classList.contains('comment-input') && !e.target.classList.contains('post-comment')) {
                let parent = value.parentNode
                let parent_style = parent.style.display.toString()
                if (parent_style === 'block') {
                    let child_1 = value.parentNode.parentNode.children.item(1)
                    console.log(value)
                    let child_2 = value.parentNode.parentNode.children.item(0)
                    child_1.style.display = 'none'
                    child_2.style.display = 'block'
                }
            }
        }
    })
    document.querySelectorAll('.post-problem').forEach(value => {
        if (click_to_close === true) {
            if (!e.target.classList.contains('comment-input') && !e.target.classList.contains('post-problem')) {
                let parent = value.parentNode
                let parent_style = parent.style.display.toString()
                if (parent_style === 'block') {
                    let child_1 = value.parentNode.parentNode.children.item(1)
                    console.log(value)
                    let child_2 = value.parentNode.parentNode.children.item(0)
                    child_1.style.display = 'none'
                    child_2.style.display = 'block'
                }
            }
        }
    })
})


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.p-files').forEach(value => {
        value.addEventListener('click', function () {
            downloadFile(value.id)
        })
    })
    redirecting()
    problemsManager();
    commentsManager();
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


function download_all() {
    document.querySelectorAll('.archive-btn').forEach(value => {
        value.addEventListener('click', function () {
            downloadArchive(value.getAttribute('phase_id'))
        })
    })
}

download_all()

function redirecting() {
    const tbody = document.getElementById('projects-body');
    const datas = document.querySelectorAll('.datas');
    datas.forEach((value, index) => {
        if (index === datas.length - 1) return;
        for (let i = 0; i < value.children.length ; i++) {
            if (i === value.children.length-1 ) return;
                 value.children.item(i).addEventListener('click', function () {
            window.location.href = value.getAttribute('data-url');
        });
        }
    });
}
function edit_phase(){
    let input = document.createElement('input')
    document.querySelectorAll('.edit-phase-btn').forEach(value => {
        value.addEventListener('click',function (){
            let parent = value.parentNode.parentNode.parentNode
            let phase = parent.children.item(0)
            input.classList.add('form-control')
            input.value = phase.textContent.trim()
            phase.classList.remove('d-inline')
            phase.classList.add('d-none')
            parent.children.item(1).style.display = 'none'
            parent.appendChild(input)
            document.addEventListener('keypress',function (e) {
                if(e.key==='Enter'){
                    sendPostRequest2(`update-phase/${phase.getAttribute('phase_id')}`,{'phase_name':input.value}).then(res=>{
                        if(res.status === 'ok'){
                            phase.innerText = input.value
                            phase.classList.remove('d-none')
                            phase.classList.add('d-inline')
                            parent.children.item(1).style.display = 'inline'
                            input.remove()

                        }
                    })
                }

            })

        })
    })
}

edit_phase()

function delete_phase(){
    document.querySelectorAll('.delete-phase-btn').forEach(value => {
        value.addEventListener('click',function (){
            let parent = value.parentNode.parentNode.parentNode
            let phase = parent.children.item(0)
            let confirm_btn = parent.querySelector('.delete-phase-confirm')
            confirm_btn.addEventListener('click',function (){
                fetch(`delete-phase/${phase.getAttribute('phase_id')}`).then(res=>{
                    if(res.status === 200){
                        confirm_btn.parentNode.children.item(1).click()
                        parent.parentNode.removeChild(parent)
                        parent.removeChild(parent.children.item(1))
                    }
                })
            })
        })
    })
}

delete_phase()

function delete_files() {

    document.querySelectorAll('.delete-files').forEach(value => {
        value.addEventListener('click', function () {
            let phase_id = value.getAttribute('phase_id');
            let files = document.getElementById(`files${phase_id}`);
            let children = Array.from(files.children);

            children.forEach(child => {
                let input = document.createElement('input');
                input.classList.add('del-files');
                input.type = 'checkbox';
                input.id = child.id;
                files.insertBefore(input, child);
            });

            let confirm_btn = document.createElement('button')
            let cancel_btn = document.createElement('button')
            confirm_btn.classList.add('btn', 'btn-danger', 'del-confirm')
            cancel_btn.classList.add('btn', 'btn-secondary', 'cancel-delete-file')
            confirm_btn.innerText = "O'chirish"
            cancel_btn.innerText = "Bekor qilish"
            confirm_btn.style.marginTop = '1%'
            cancel_btn.style.marginTop = '1%'
            confirm_btn.style.height = '20%'
            cancel_btn.style.height = '20%'
            files.parentNode.appendChild(confirm_btn)
            files.parentNode.appendChild(cancel_btn)
            document.querySelectorAll('.del-files').forEach(value => {
                value.addEventListener('change', listen_del_files)
            })

            confirm_btn.addEventListener('click', function (e) {
                confirm_btn.parentNode.removeChild(confirm_btn)
                let conf_final_btn = document.createElement('button')
                conf_final_btn.classList.add('btn', 'btn-danger')
                conf_final_btn.innerText = 'Tasdiqlayman'
                conf_final_btn.style.marginTop = '1%'
                conf_final_btn.style.height = '20%'
                files.parentNode.insertBefore(conf_final_btn, cancel_btn)
                conf_final_btn.addEventListener('click', function () {
                    sendPostRequest2('delete-files/', {'datas': delFiles}).then(res => {
                        document.querySelectorAll('.del-files').forEach(value => value.parentNode.removeChild(value))
                        delFiles.forEach(value => {
                            document.getElementById(value).remove()
                            conf_final_btn.remove()
                            cancel_btn.remove()
                        })
                    })
                })
                cancel_btn.addEventListener('click', function () {
                    delFiles = []
                    document.querySelectorAll('.del-files').forEach(value => value.parentNode.removeChild(value))
                    conf_final_btn.remove()
                    cancel_btn.remove()


                })

            })
                            cancel_btn.addEventListener('click', function () {
                    delFiles = []
                    document.querySelectorAll('.del-files').forEach(value => value.parentNode.removeChild(value))
                    confirm_btn.remove()
                    cancel_btn.remove()


                })

        });
    });
}


delete_files()
var delFiles = []

function listen_del_files(e) {
    let file = e.target
    if (file.checked === true) {
        delFiles.push(file.id);
    } else {
        delFiles = delFiles.filter(item => item !== file.id);
    }
    console.log(delFiles)


}


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


let task_id;

function generate_select(selected = 0) {
    let td = ''
    for (i = 0; i <= 100; i += 5) {
        if (i === selected) {
            td += `<option selected>${i}</option>`
        } else {
            td += `<option>${i}</option>`
        }
    }
    return `<select name="task_done_percentage" class="form-control">${td}</select>`
}

function initTaskManager() {
    let task_elements = document.querySelectorAll('.add-task');
    task_elements.forEach(task_element => {
        task_element.addEventListener('click', add_task_handler)
        const task_tr = document.querySelectorAll('.task-tr');
        task_tr.forEach(value => {
            value.addEventListener('click', function () {
                task_id = value.id
                task_percentage = value.children[3].textContent

            });
            value.addEventListener('click', click_tr_handler);
        });

    });
}

function document_listener() {
    document.querySelectorAll('.add-file').forEach(value => {
        value.addEventListener('click', function (index) {
            let form = document.getElementById(`add_file_form_${value.getAttribute('phase_id')}`)
            let input = form.children.item(1).children.item(1)
            input.click()
            input.addEventListener('change', document_change_listener)
        })
    })
}


document_listener()

function document_change_listener(event) {
    let form = event.target.parentNode.parentNode
    form.querySelector('div').children.item(0).click()
    const formData = new FormData(form);
    let doc_name = formData.get('document').name;
    let p_id = window.location.href.split('/').pop();

    fetch(`${p_id}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': form.csrfmiddlewaretoken.value
        },
        body: formData,
    })
        .then(res => res.json())
        .then(res => {
            let phase_id = form.id.split('_')[3];
            console.log(phase_id)
            let docs = document.getElementById('files' + phase_id);
            let newDoc = document.createElement('div');
            newDoc.innerHTML = `
                    <div id="${res.doc_id}" class="card-file p-files card grid-item-file mx-2" style="width: 10rem;">
                        <i class="fa-solid fa-${res.doc_type}"></i>
                        <img src="https://telegra.ph/file/ab7d76d0b10f3fa7dcbd7.jpg" class="card-img-top">
                        <div class="card-body">
                            <p class="card-text">${doc_name}</p>
                            <small>${res.created_at}</small>
                        </div>
                    </div>
                `;
            docs.appendChild(newDoc);

            newDoc.addEventListener('click', function () {
                downloadFile(newDoc.children.item(0).id);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function add_task_handler(event) {
    let task_element = event.target;
    let data = [];
    let full_data = [];
    let phase_id = task_element.getAttribute('phase_id');
    let table = document.getElementById(phase_id).querySelector('tbody');
    table.insertAdjacentHTML('beforeend', `<tr class="rows-with-inputs">
                            <td><input type="text" name="task_name" class="form-control" placeholder="Topshiriq nomi"/></td>
                            <td><input name="task_manager" type="text" class="form-control" placeholder="Ma'sul shaxs"/></td>
                            <td><input name="task_deadline" type="date" class="form-control" placeholder="Tugash sanasi"/></td>
                            <td><button class="btn btn-light save-buttons"><i class="fa-solid fa-floppy-disk"></i> Saqlash</button><i class="fa-solid fa-trash-can remove-tr btn btn-danger mx-2"></i></td>
                        </tr>`)
    table.querySelectorAll('.save-buttons').forEach(saveBtn => {
        saveBtn.addEventListener('click', function () {
            data = [];
            saveBtn.parentNode.parentNode.childNodes.forEach(td => {
                let element = td.firstChild;
                if (element && element.tagName === 'INPUT') {
                    let el_name = element.name;
                    let el_value = element.value;
                    data.push({[el_name]: el_value});
                }
            });
            full_data.push(data);
            sendPostRequest2(`add-task/${phase_id}`, full_data).then(resp => {
                task_id = resp.task_id;
                data = [];

                table.querySelectorAll('.rows-with-inputs').forEach(row => {
                    row.remove();
                });
                full_data.forEach(data => {
                    let date = data[2].task_deadline.split('-').reverse().join('-');
                    table.insertAdjacentHTML('beforeend', `<tr class="task-tr" id="${task_id}">
                                            <td task_id="${task_id}" style="cursor: pointer">${data[0].task_name}</td>
                                            <td task_id="${task_id}" style="cursor: pointer">${data[1].task_manager}</td>
                                            <td task_id="${task_id}" style="cursor: pointer">${date}</td>
                                            <td task_id="${task_id}" style="cursor: pointer">0%</td>
                                        </tr>`);
                    table.lastChild.addEventListener('click', click_tr_handler)
                });

                full_data = [];

            });
        });
    });

    table.querySelectorAll('.remove-tr').forEach(removeBtn => {
        removeBtn.addEventListener('click', function () {
            removeBtn.parentNode.parentNode.remove();
        });
    });
}


function phase_adder() {
    let parent = document.getElementById('add-phase-btn').parentNode;
    parent.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'add-phase-btn') {
            event.target.remove();
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `
    <div id="add-phase-div" class="d-block border-bottom main-row">
        <input id="new-phase-input" type="text" placeholder="Faza nomini yozing" class="form-control">
        <button id="add-phase-btn-submit" class="btn btn-default mt-2">Qo'shish</button>
        <button id="add-phase-btn-cancel" class="btn btn-default mt-2 mx-1">Bekor qilish</button>
    </div>
`;
            parent.appendChild(newDiv)
            document.getElementById('add-phase-btn-submit').addEventListener('click', function () {

                let phase = document.getElementById('new-phase-input').value;
                let p_array = window.location.href.split('/');
                let p_id = p_array[p_array.length - 1]
                sendPostRequest2(`add-phase/${p_id}`, {'phase_name': phase}).then(res => {
                    document.getElementById('add-phase-btn-cancel').click()
                    parent.lastChild.remove()
                    parent.innerHTML = parent.innerHTML + `<div class="d-block border-bottom main-row">
                                                                                        <h4 type="button" data-toggle="modal"
                                                data-target="#modal${res.phase_id}" data-backdrop="static"
                                                class="text-secondary d-inline phase_text">${res.phase}</h4>
                                            </div><button id="add-phase-btn" class="btn btn-default mt-2">Qo'shish</button>`
                    location.reload()
                })
            })
            document.getElementById('add-phase-btn-cancel').addEventListener('click', function (e) {
                document.getElementById('add-phase-div').remove();
                parent.innerHTML += `<button id="add-phase-btn" class="btn btn-default mt-2">Qo'shish</button>`;

            });
        }
        if (event.target && event.target.id === 'add-phase-btn') {
            phase_adder();
        }
    });
}


phase_adder()


function delete_comment() {
    let comment_id
    document.querySelectorAll('.delete-comment-btn').forEach(value => {
        value.addEventListener('click', function () {
            comment_id = value.id.split('_')[2]
            let parent = value.parentNode
            parent.style.display = 'none'
            let newDiv = document.createElement('div')
            newDiv.innerHTML = `<small  id="delete_comment_confirm" type="button"
                                                                                        class="text-secondary delete-comment-btn mr-3">Tasdiqlash</small><small  id="delete_comment_cancel" type="button"
                                                                                        class="text-secondary delete-comment-btn mr-3">Bekor qilish</small>`
            value.parentNode.parentNode.appendChild(newDiv)
            document.getElementById('delete_comment_cancel').addEventListener('click', function (e) {
                let value = e.target
                value.parentNode.remove()
                parent.style.display = 'block'
            })
            document.getElementById('delete_comment_confirm').addEventListener('click', function (e) {
                fetch(`delete-comment/${comment_id}`).then(res => {
                    let parent = e.target.parentNode.parentNode.parentNode.parentNode
                    parent.parentNode.removeChild(parent)
                })
            })
        })
    })
}

delete_comment()

function delete_problem() {
    let problem_id
    document.querySelectorAll('.delete-problem-btn').forEach(value => {
        value.addEventListener('click', function () {
            problem_id = value.id.split('_')[2]
            let parent = value.parentNode
            parent.style.display = 'none'
            let newDiv = document.createElement('div')
            newDiv.innerHTML = `<small  id="delete_problem_confirm" type="button"
                                                                                        class="text-secondary delete-problem-btn mr-3">Tasdiqlash</small><small  id="delete_problem_cancel" type="button"
                                                                                        class="text-secondary delete-problem-btn mr-3">Bekor qilish</small>`
            value.parentNode.parentNode.appendChild(newDiv)
            document.getElementById('delete_problem_cancel').addEventListener('click', function (e) {
                let value = e.target
                value.parentNode.remove()
                parent.style.display = 'block'
            })
            document.getElementById('delete_problem_confirm').addEventListener('click', function (e) {
                fetch(`delete-problem/${problem_id}`).then(res => {
                    let parent = e.target.parentNode.parentNode.parentNode.parentNode
                    parent.parentNode.removeChild(parent)
                })
            })
        })
    })
}

delete_problem()

function click_tr_handler(event) {
    const value = event.currentTarget;
    const original_row = value.innerHTML;
    let data2 = []

    let task = fetch(`get-task/${task_id}`).then(res => {
        res.json().then(response => {
            task = JSON.parse(response)[0]['fields']
            value.innerHTML = `<td><input type="text" name="task_name" class="form-control" value="${task.task_name}" placeholder="Topshiriq nomi"/></td><td><input name="task_manager" value="${task.task_manager}" type="text" class="form-control" placeholder="Ma'sul shaxs"/></td><td><input name="task_deadline" value="${task.task_deadline}" type="date" class="form-control" placeholder="Tugash sanasi"/></td><td>${generate_select(parseInt(task.task_done_percentage))}</td><td task_id="${task_id}"><button id="save-edit-buttons" class="btn btn-sm btn-light save-edit-buttons"><i class="fa-solid fa-floppy-disk"></i></button><i id="cancel-changes" class="fa-solid fa-xmark btn btn-sm btn-light mt-2"></i><i class="fa-solid fa-trash mt-2 delete-task-btn btn btn-sm btn-light"></i></td>`;
            value.removeEventListener('click', click_tr_handler);
            document.addEventListener('click', function cancel_changes_handler(event) {
                if (event.target && event.target.id === 'cancel-changes') {
                    value.innerHTML = original_row;
                    value.addEventListener('click', click_tr_handler);
                }
            });
            document.querySelectorAll('.delete-task-btn').forEach(value => {
                value.addEventListener('click', function () {
                    console.log(value.parentNode.parentNode)
                    value.parentNode.innerHTML = `<i id="confirm-delete-task" class="fa-solid btn btn-sm btn-default fa-check"></i><i id="cancel-changes" class="fa-solid btn btn-sm btn-default fa-xmark"></i>`
                    document.getElementById('confirm-delete-task').addEventListener('click', function () {
                        fetch(`delete-task/${task_id}`).then(res => {
                            document.getElementById('cancel-changes').click()
                            document.getElementById(task_id).remove()
                        })
                    })
                })
            })
            document.querySelectorAll('.save-edit-buttons').forEach(value => {

                value.addEventListener('click', function () {
                    value.parentNode.parentNode.childNodes.forEach(element => {
                        console.log(element.firstChild)
                        let el_name = element.firstChild.name
                        let el_value = element.firstChild.value
                        data2.push({[el_name]: el_value})
                    })

                    sendPostRequest2(`update-task/${task_id}`, data2).then(res => {
                        let parent = value.parentNode.parentNode
                        let date = data2[2].task_deadline.split('-').reverse().join('-')
                        parent.innerHTML = `<td>${data2[0]['task_name']}</td><td>${data2[1]['task_manager']}</td> <td>${date}</td><td>${res.task_percentage}%</td>`
                        parent.addEventListener('click', click_tr_handler)
                    })
                })
            })
        })
    })
}

initTaskManager()

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

function formatDateAndTimeDifference(dateString) {
    const inputDate = new Date(dateString);
    const now = new Date();
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');

    const diffMilliseconds = now - inputDate;
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    let timeAgo = '';
    if (diffYears > 0) {
        timeAgo = `${diffYears} yil${diffYears > 1 ? 's' : ''} oldin`;
    } else if (diffMonths > 0) {
        timeAgo = `${diffMonths} oy${diffMonths > 1 ? 's' : ''} oldin`;
    } else if (diffWeeks > 0) {
        timeAgo = `${diffWeeks} hafta${diffWeeks > 1 ? 's' : ''} oldin`;
    } else if (diffDays > 0) {
        timeAgo = `${diffDays} kun${diffDays > 1 ? 's' : ''} oldin`;
    } else if (diffHours > 0) {
        timeAgo = `${diffHours} soat${diffHours > 1 ? 's' : ''} oldin`;
    } else {
        timeAgo = `${diffMinutes} daqiqa${diffMinutes > 1 ? 's' : ''} oldin`;
    }

    const formattedDate = `${year}-${month}-${day}T${inputDate.toTimeString().split(' ')[0]}`;
    return `${timeAgo}_${formattedDate}`;
}

function commentInputManager(event) {
    let comment = event.target
    comment.parentNode.children.item(0).style.display = 'none'
    comment.parentNode.children.item(1).style.display = 'block'
    click_to_close = true

}

function commentsManager() {
    let comment_inputs = document.querySelectorAll('.comment-input');
    var parent
    comment_inputs.forEach(comment => {
        comment.addEventListener('click', commentInputManager)
        comment.addEventListener('click', function () {
            parent = comment.parentNode
        })
    })
    document.querySelectorAll('.post-comment').forEach(form => {
        form.addEventListener('submit', post_comment)
    })

}


function post_comment(e) {
    let form = e.target
    e.preventDefault()
    let formData = new FormData(form)
    let summernote = form.children.item(2).querySelector('iframe').contentDocument.querySelector('body').getElementsByClassName('note-editing-area').item(0).children.item(2)
    let phase = e.target.getAttribute('phase_id')
    formData.append('comment', summernote.innerHTML)
    let url = `post-comment/${phase}`
    console.log(url)
    fetch(`${url}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': form.csrfmiddlewaretoken.value
        },
        body: formData,
    })
        .then(res => res.json().then(res => {
            console.log(res)
            comment_id = res.comment_id
            let div = document.createElement('div')
            let div1 = document.createElement('div')
            let div2 = document.createElement('div')
            div.classList.add('row')
            div1.classList.add('col-0')
            div2.classList.add('col-11')
            let date = formatDateAndTimeDifference(res.comment_date).split('_')
            div1.innerHTML = `
                                    <span><img src=${res.author_avatar} height="35" width="35" style="border-radius: 40%"></span>`
            div2.innerHTML = `
                                   <div style="margin-top: 2%; display: flex; flex-direction: column;">
    <span class="d-block" style="margin: 0;padding: 0"><b style="margin: 0;padding: 0">${res.author_name}</b><div class="d-inline mx-2"></div><p class="text-sm text-secondary d-inline">${date[0]}</p></span>
    <small style="margin: 0;padding:0">${date[1].split('T')[0].split('-').reverse().join('-')}</small>
    <div style="margin-top: 1%">${res.comment}</div>
    <div><small id="delete_comment_${res.comment_id}"  type="button" class="text-secondary delete-comment-btn  mr-3">O'chirish</small>        <small id="edit_comment_${res.comment_id}" type="button" class="text-secondary edit-comment">Tahrirlash</small></div>
</div>
`
            let form2 = document.createElement('form')
            form2.method = 'post'
            form2.enctype = "multipart/form-data"
            form2.classList.add('edit-comment-form')
            form2.setAttribute('comment_id', comment_id)
            form2.style.display = 'none'
            let div3 = document.createElement('div')
            div3.innerHTML = `${res.form.innerHTML}`
            form2.innerHTML = `<input type="hidden" name="csrfmiddlewaretoken" value="eUlbeAMl7MACovcIOsvIKWuYHo3i77HNENX49HRtKTrLtrzOx1gyuJkzxeof9lLC">${res.form}<button type="submit" class="btn btn-md btn-secondary">
                                                                                    Yuborish
                                                                                </button>`
            div2.children.item(0).appendChild(form2)
            form2.addEventListener('submit', submit_edit_comment)
            console.log(div2)
            let children = div2.children.item(0).children.item(3)
            children.children.item(0).addEventListener('click', delete_comment)
            children.children.item(1).addEventListener('click', comments_listener)
            let comments_list = form.parentNode.parentNode.parentNode.parentNode.parentNode.children.item(8)
            div.appendChild(div1)
            div.appendChild(div2)
            comments_list.parentNode.appendChild(div)
            form.parentNode.parentNode.children.item(0).style.display = 'block'
            form.parentNode.parentNode.children.item(1).style.display = 'none'

        }))
}

function comments_listener(e) {
    let value = e.target
    let comment = value.parentNode.parentNode.children.item(2)
    comment.style.display = 'none'
    let form = value.parentNode.parentNode.parentNode.querySelector('form')
    form.style.display = 'block'
    console.log(form.children.item(1))
    let summernote = form.children.item(1).children.item(4).querySelector('iframe').contentDocument.querySelector('body').getElementsByClassName('note-editing-area').item(0).children.item(2)
    summernote.innerHTML = comment.innerHTML
    form.id = 'edit-comment-form'
    form.addEventListener('submit', submit_edit_comment)
}

document.querySelectorAll('.edit-comment').forEach(value => {
    value.addEventListener('click', comments_listener)

})

function problems_listener(e) {
    let value = e.target
    let comment = value.parentNode.parentNode.children.item(2)
    comment.style.display = 'none'
    console.log(value.parentNode.parentNode.parentNode.querySelector('form').children.item(5))
    let form = value.parentNode.parentNode.parentNode.querySelector('form')
    form.style.display = 'block'
    let summernote = form.children.item(1).children.item(4).querySelector('iframe').contentDocument.querySelector('body').getElementsByClassName('note-editing-area').item(0).children.item(2)
    summernote.innerHTML = comment.innerHTML
    form.id = 'edit-problem-form'
    form.addEventListener('submit', submit_edit_problem)
}

document.querySelectorAll('.edit-problem').forEach(value => {
    value.addEventListener('click', problems_listener)

})


function submit_edit_comment(e) {
    e.preventDefault()
    let form = e.target
    let summernote = form.children.item(1).children.item(4).querySelector('iframe').contentDocument.querySelector('body').getElementsByClassName('note-editing-area').item(0).children.item(2)
    let c_id = form.getAttribute('comment_id')
    let formData = new FormData(form)
    formData.append('comment', summernote.innerHTML)
    fetch(`edit-comment/${c_id}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': form.csrfmiddlewaretoken.value
        },
        body: formData,
    }).then(res => res.json()).then(res => {
        console.log(res)
        form.style.display = 'none'
        console.log(form.parentNode)
        form.parentNode.children.item(2).innerHTML = res.comment
        form.parentNode.children.item(2).style.display = 'block'
    })
}

function submit_edit_problem(e) {
    e.preventDefault()
    let form = e.target
    console.log(form)
    let summernote = form.children.item(1).children.item(4).querySelector('iframe').contentDocument.querySelector('body').getElementsByClassName('note-editing-area').item(0).children.item(2)
    console.log(summernote.innerHTML)
    let c_id = form.getAttribute('problem_id')
    let formData = new FormData(form)
    formData.append('problem', summernote.innerHTML)
    fetch(`edit-problem/${c_id}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': form.csrfmiddlewaretoken.value
        },
        body: formData,
    }).then(res => res.json()).then(res => {
        console.log(res)
        form.style.display = 'none'
        console.log(form.parentNode)
        form.parentNode.children.item(2).innerHTML = res.comment
        form.parentNode.children.item(2).style.display = 'block'
    })
}

function phasesManager() {
    document.querySelectorAll('.phases-text').forEach(value => {
        value.addEventListener('click', function () {
            let phase_id = value.children.item(0).getAttribute('data-target').slice(6)
            let modal = document.getElementById(`modal${phase_id}`)
            modal.querySelector('.add-file-forms').children.item(2).children.item(1).value = phase_id
        })
    })
}

phasesManager()

function action_manager() {
    document.querySelectorAll('.actions-btn').forEach(value => {
        value.addEventListener('click', actions_btn)
    })
}

action_manager()

function actions_btn(e) {
    let btn = e.target
    let data = btn.id.split('_')
    btn.parentNode.querySelectorAll('div').forEach(value => value.classList.remove('active'))
    btn.classList.add('active')
    var form
    if (btn.parentNode.parentNode.querySelector('.post-comment')) {
        form = btn.parentNode.parentNode.querySelector('.post-comment')
    } else {
        form = btn.parentNode.parentNode.querySelector('.post-problem')
    }
    if (data[0] === 'problems') {
        console.log(data[0])
        form.classList.add('post-problem')
        form.classList.remove('post-comment')
        form.removeEventListener('submit', post_comment)
        form.addEventListener('submit', handle_problem_submit)
        let row = document.getElementById(`problems_row_${data[1]}`)
        row.parentNode.querySelectorAll('.commments').forEach(value => value.style.display = 'none')
        document.getElementById(`problems_row_${data[1]}`).style.display = 'block'
        document.getElementById(`actions_row_${data[1]}`).style.display = 'none'
    }
    if (data[0] === 'comments') {
        console.log(data[0])
        console.log(form)
        let row = document.getElementById(`problems_row_${data[1]}`)
        row.parentNode.querySelectorAll('.commments').forEach(value => value.style.display = 'flex')
        document.getElementById(`problems_row_${data[1]}`).style.display = 'none'
        form.removeEventListener('submit', handle_problem_submit)
        form.addEventListener('submit', post_comment)
        document.getElementById(`actions_row_${data[1]}`).style.display = 'none'
    }
    if (data[0] === 'actions') {
        document.getElementById(`problems_row_${data[1]}`).style.display = 'none'
        let row = document.getElementById(`actions_row_${data[1]}`)
        row.parentNode.querySelectorAll('.commments').forEach(value => value.style.display = 'none')
        document.getElementById(`actions_row_${data[1]}`).style.display = 'block'
    }
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

function handle_problem_submit(e) {
    let form = e.target
    e.preventDefault()
    let formData = new FormData(form)
    let summernote = form.children.item(2).querySelector('iframe').contentDocument.querySelector('body').getElementsByClassName('note-editing-area').item(0).children.item(2)
    let phase = e.target.getAttribute('phase_id')
    formData.append('problem', summernote.innerHTML)
    let url = `post-problem/${phase}`
    console.log(url)
    fetch(`${url}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': form.csrfmiddlewaretoken.value
        },
        body: formData,
    })
        .then(res => res.json().then(res => {
            console.log(res)
            comment_id = res.comment_id
            let div = document.createElement('div')
            let div1 = document.createElement('div')
            let div2 = document.createElement('div')
            div.classList.add('row')
            div1.classList.add('col-0')
            div2.classList.add('col-11')
            let date = formatDateAndTimeDifference(res.comment_date).split('_')
            div1.innerHTML = `
                                    <span><img src=${res.author_avatar} height="35" width="35" style="border-radius: 40%"></span>`
            div2.innerHTML = `
                                   <div style="margin-top: 2%; display: flex; flex-direction: column;">
    <span class="d-block" style="margin: 0;padding: 0"><b style="margin: 0;padding: 0">${res.author_name}</b><div class="d-inline mx-2"></div><p class="text-sm text-secondary d-inline">${date[0]}</p></span>
    <small style="margin: 0;padding:0">${date[1].split('T')[0].split('-').reverse().join('-')}</small>
    <div style="margin-top: 1%">${res.comment}</div>
    <div><small id="delete_problem_${res.comment_id}"  type="button" class="text-secondary delete-comment-btn  mr-3">O'chirish</small>        <small id="edit_problem_${res.comment_id}" type="button" class="text-secondary edit-comment">Tahrirlash</small></div>
</div>
`
            let form2 = document.createElement('form')
            form2.method = 'post'
            form2.enctype = "multipart/form-data"
            form2.classList.add('edit-comment-form')
            form2.setAttribute('comment_id', comment_id)
            form2.style.display = 'none'
            let div3 = document.createElement('div')
            div3.innerHTML = `${res.form.innerHTML}`
            form2.innerHTML = `<input type="hidden" name="csrfmiddlewaretoken" value="eUlbeAMl7MACovcIOsvIKWuYHo3i77HNENX49HRtKTrLtrzOx1gyuJkzxeof9lLC">${res.form}<button type="submit" class="btn btn-md btn-secondary">
                                                                                    Yuborish
                                                                                </button>`
            div2.children.item(0).appendChild(form2)
            form2.addEventListener('submit', submit_edit_comment)
            console.log(div2)
            let children = div2.children.item(0).children.item(3)
            children.children.item(0).addEventListener('click', delete_comment)
            children.children.item(1).addEventListener('click', comments_listener)
            let comments_list = form.parentNode.parentNode.parentNode.parentNode.parentNode.children.item(8)
            div.appendChild(div1)
            div.appendChild(div2)
            comments_list.parentNode.appendChild(div)
            form.parentNode.parentNode.children.item(0).style.display = 'block'
            form.parentNode.parentNode.children.item(1).style.display = 'none'

        }))
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
            } else {
                return response.json()
            }
        })
        .catch(error => console.error('Error:', error));
}

function sendPostRequest2(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }).then(response => {
        return response;
    }).catch(error => {
        console.error('Error fetching data:', error);
        throw error;
    });
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
    console.log('working listeners')
    var delete_expense_modal = document.getElementById('delete-expense-btn');
    var e_id
    document.querySelectorAll('.delete-expense').forEach(value => {
        value.addEventListener('click', function () {
            e_id = value.id
            console.log('working')

        })
    })
    var delete_expense_btn = document.getElementById('confirm-delete-expense-btn');
    delete_expense_btn.addEventListener('click', function () {
        console.log('licked')
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

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})


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
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        },
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            a.style = 'display: none';
            document.body.appendChild(a);
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = `${pk}.zip`;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        error: function (xhr, status, error) {
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
                return response.blob().then(blob => ({filename, blob}));
            }
            throw new Error('Network response was not ok.');
        })
        .then(({filename, blob}) => {
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