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
    commentsManager();
    initTabs();
    initTaskManager();
    initFilterToggle();
});


function download_all() {
    document.querySelectorAll('.archive-btn').forEach(value => {
        value.addEventListener('click', function () {
            downloadArchive(value.getAttribute('phase_id'))
        })
    })
}

try {
    download_all()
}catch (e){

}

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

try {
    edit_phase()
}catch (e){}


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

try {
    delete_phase()
}catch (e){

}

function deleteFiles() {
    const deleteButtons = document.querySelectorAll('.delete-files');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const phaseId = button.getAttribute('phase_id');
            const files = document.getElementById(`files${phaseId}`);

            if (!files) return;

            addCheckboxes(files);
            const { confirmButton, cancelButton } = addActionButtons(files);

            const delFiles = [];

            document.querySelectorAll('.del-files').forEach(checkbox => {
                checkbox.addEventListener('change', () => listenDelFiles(checkbox, delFiles));
            });

            confirmButton.addEventListener('click', () => {
                confirmButton.remove();
                const confirmFinalButton = createButton('Tasdiqlayman', ['btn', 'btn-danger']);
                files.parentNode.insertBefore(confirmFinalButton, cancelButton);

                confirmFinalButton.addEventListener('click', () => {
                    sendPostRequest2('delete-files/', { 'datas': delFiles }).then(res => {
                        delFiles.forEach(id => {
                            const element = document.getElementById(id);
                            if (element) element.remove();
                        });
                        removeCheckboxes();
                        confirmFinalButton.remove();
                        cancelButton.remove();
                    });
                });

                cancelButton.addEventListener('click', () => {
                    cancelDelete(delFiles, confirmFinalButton, cancelButton);
                });
            });

            cancelButton.addEventListener('click', () => {
                cancelDelete(delFiles, confirmButton, cancelButton);
            });
        });
    });
}

function addCheckboxes(files) {
    const children = Array.from(files.children);
    children.forEach(child => {
        const input = document.createElement('input');
        input.classList.add('del-files');
        input.type = 'checkbox';
        input.id = child.id;
        files.insertBefore(input, child);
    });
}

function addActionButtons(files) {
    const confirmButton = createButton("O'chirish", ['btn', 'btn-danger', 'del-confirm']);
    const cancelButton = createButton('Bekor qilish', ['btn', 'btn-secondary', 'cancel-delete-file']);

    files.parentNode.appendChild(confirmButton);
    files.parentNode.appendChild(cancelButton);

    return { confirmButton, cancelButton };
}

function createButton(text, classes) {
    const button = document.createElement('button');
    button.innerText = text;
    button.classList.add(...classes);
    Object.assign(button.style, { marginTop: '1%', height: '20%' });
    return button;
}

function listenDelFiles(checkbox, delFiles) {
    if (checkbox.checked) {
        delFiles.push(checkbox.id);
    } else {
        const index = delFiles.indexOf(checkbox.id);
        if (index > -1) delFiles.splice(index, 1);
    }
}

function cancelDelete(delFiles, confirmButton, cancelButton) {
    delFiles.length = 0;
    removeCheckboxes();
    confirmButton.remove();
    cancelButton.remove();
}

function removeCheckboxes() {
    document.querySelectorAll('.del-files').forEach(checkbox => {
        checkbox.parentNode.removeChild(checkbox);
    });
}


try {
    deleteFiles()
}catch (e){

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

try {
    document_listener()
}catch (e){

}

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

try {
    phase_adder()
}catch (e){

}


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

try {
    delete_comment()
}catch (e){

}

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

try {
    delete_problem()
}catch (e){

}

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

try {
    initTaskManager()
}catch (e){}




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


function post_comment(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const summernote = form.querySelector('iframe')
        .contentDocument.querySelector('body .note-editing-area').children[2];
    const phase = form.getAttribute('phase_id');
    formData.append('comment', summernote.innerHTML);
    const url = `post-comment/${phase}`;
    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': form.csrfmiddlewaretoken.value
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => handleResponse(data, form))
    .catch(error => console.error('Error:', error));
}

function handleResponse(data, form) {
    const commentId = data.comment_id;
    const newCommentElement = createCommentElement(data);

    const commentsList = form.closest('.comments-section').querySelector('.comments-list');
    commentsList.appendChild(newCommentElement);

    toggleFormVisibility(form);
}

function createCommentElement(data) {
    const commentWrapper = document.createElement('div');
    commentWrapper.classList.add('row');

    const authorDiv = document.createElement('div');
    authorDiv.classList.add('col-0');
    authorDiv.innerHTML = `<span><img src="${data.author_avatar}" height="35" width="35" style="border-radius: 40%"></span>`;

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('col-11');
    contentDiv.innerHTML = createCommentHTML(data);

    const form = createEditCommentForm(data);
    contentDiv.querySelector('.comment-content').appendChild(form);

    addEventListeners(contentDiv, data.comment_id);

    commentWrapper.appendChild(authorDiv);
    commentWrapper.appendChild(contentDiv);

    return commentWrapper;
}

function createCommentHTML(data) {
    const date = formatDateAndTimeDifference(data.comment_date).split('_');
    const formattedDate = date[1].split('T')[0].split('-').reverse().join('-');

    return `
        <div style="margin-top: 2%; display: flex; flex-direction: column;">
            <span class="d-block" style="margin: 0;padding: 0">
                <b style="margin: 0;padding: 0">${data.author_name}</b>
                <div class="d-inline mx-2"></div>
                <p class="text-sm text-secondary d-inline">${date[0]}</p>
            </span>
            <small style="margin: 0;padding:0">${formattedDate}</small>
            <div class="comment-content" style="margin-top: 1%">${data.comment}</div>
            <div>
                <small id="delete_comment_${data.comment_id}" class="text-secondary delete-comment-btn mr-3" type="button">O'chirish</small>
                <small id="edit_comment_${data.comment_id}" class="text-secondary edit-comment" type="button">Tahrirlash</small>
            </div>
        </div>
    `;
}

function createEditCommentForm(data) {
    const form = document.createElement('form');
    form.method = 'post';
    form.enctype = "multipart/form-data";
    form.classList.add('edit-comment-form');
    form.setAttribute('comment_id', data.comment_id);
    form.style.display = 'none';

    form.innerHTML = `
        <input type="hidden" name="csrfmiddlewaretoken" value="eUlbeAMl7MACovcIOsvIKWuYHo3i77HNENX49HRtKTrLtrzOx1gyuJkzxeof9lLC">
        ${data.form}
        <button type="submit" class="btn btn-md btn-secondary">Yuborish</button>
    `;

    form.addEventListener('submit', submitEditComment);

    return form;
}

function addEventListeners(contentDiv, commentId) {
    const deleteButton = contentDiv.querySelector(`#delete_comment_${commentId}`);
    const editButton = contentDiv.querySelector(`#edit_comment_${commentId}`);

    deleteButton.addEventListener('click', deleteComment);
    editButton.addEventListener('click', commentsListener);
}

function toggleFormVisibility(form) {
    form.closest('.comment-input-section').querySelector('.new-comment').style.display = 'block';
    form.style.display = 'none';
}


function comments_listener(e) {
    let value = e.target
    let comment = value.parentNode.parentNode.children.item(2)
    comment.style.display = 'none'
    let form = value.parentNode.parentNode.parentNode.querySelector('form')
    form.style.display = 'block'
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
        form.style.display = 'none'
        console.log(form.parentNode)
        form.parentNode.children.item(2).innerHTML = res.comment
        form.parentNode.children.item(2).style.display = 'block'
    })
}

function submit_edit_problem(e) {
    e.preventDefault()
    let form = e.target
    let summernote = form.children.item(1).children.item(4).querySelector('iframe').contentDocument.querySelector('body').getElementsByClassName('note-editing-area').item(0).children.item(2)
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

try {
    phasesManager()
}catch (e){}


function action_manager() {
    document.querySelectorAll('.actions-btn').forEach(value => {
        value.addEventListener('click', actions_btn)
    })
}



try {
    action_manager()
}catch (e){}




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
        let row
    switch (data[0]){
        case 'problems':
            form.classList.add('post-problem')
            form.classList.remove('post-comment')
            form.removeEventListener('submit', post_comment)
            form.addEventListener('submit', handle_problem_submit)
            row = document.getElementById(`problems_row_${data[1]}`)
            row.parentNode.querySelectorAll('.commments').forEach(value => value.style.display = 'none')
            document.getElementById(`problems_row_${data[1]}`).style.display = 'block'
            document.getElementById(`actions_row_${data[1]}`).style.display = 'none'
            break;
        case 'comments':
            row = document.getElementById(`problems_row_${data[1]}`)
            row.parentNode.querySelectorAll('.commments').forEach(value => value.style.display = 'flex')
            document.getElementById(`problems_row_${data[1]}`).style.display = 'none'
            form.removeEventListener('submit', handle_problem_submit)
            form.addEventListener('submit', post_comment)
            document.getElementById(`actions_row_${data[1]}`).style.display = 'none'
            break;
        case 'actions':
            document.getElementById(`problems_row_${data[1]}`).style.display = 'none'
            row = document.getElementById(`actions_row_${data[1]}`)
            row.parentNode.querySelectorAll('.commments').forEach(value => value.style.display = 'none')
            document.getElementById(`actions_row_${data[1]}`).style.display = 'block'
            break;

    }
}

async function handle_problem_submit(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let summernote = form.querySelector('iframe').contentDocument.querySelector('.note-editing-area .note-editable');
    let phase = form.getAttribute('phase_id');
    formData.append('problem', summernote.innerHTML);

    let url = `post-problem/${phase}`;
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': form.csrfmiddlewaretoken.value
            },
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let res = await response.json();
        let comment_id = res.comment_id;
        let comments_list = form.closest('.comments-container').querySelector('.comments-list');

        let commentDiv = createCommentElement(res);
        comments_list.appendChild(commentDiv);
        form.style.display = 'none';
        form.reset();

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function createCommentElement(res) {
    let div = document.createElement('div');
    div.classList.add('row');

    let div1 = document.createElement('div');
    div1.classList.add('col-0');
    div1.innerHTML = `<span><img src="${res.author_avatar}" height="35" width="35" style="border-radius: 40%"></span>`;

    let div2 = document.createElement('div');
    div2.classList.add('col-11');
    let date = formatDateAndTimeDifference(res.comment_date).split('_');
    div2.innerHTML = `
        <div style="margin-top: 2%; display: flex; flex-direction: column;">
            <span class="d-block"><b>${res.author_name}</b><div class="d-inline mx-2"></div><p class="text-sm text-secondary d-inline">${date[0]}</p></span>
            <small>${date[1].split('T')[0].split('-').reverse().join('-')}</small>
            <div style="margin-top: 1%">${res.comment}</div>
            <div>
                <small id="delete_problem_${res.comment_id}" type="button" class="text-secondary delete-comment-btn mr-3">O'chirish</small>
                <small id="edit_problem_${res.comment_id}" type="button" class="text-secondary edit-comment">Tahrirlash</small>
            </div>
        </div>
    `;

    let form2 = createEditCommentForm(res);
    div2.children.item(0).appendChild(form2);

    div.appendChild(div1);
    div.appendChild(div2);

    return div;
}

function createEditCommentForm(res) {
    let form2 = document.createElement('form');
    form2.method = 'post';
    form2.enctype = "multipart/form-data";
    form2.classList.add('edit-comment-form');
    form2.setAttribute('comment_id', res.comment_id);
    form2.style.display = 'none';
    form2.innerHTML = `
        <input type="hidden" name="csrfmiddlewaretoken" value="${res.csrf_token}">
        ${res.form.innerHTML}
        <button type="submit" class="btn btn-md btn-secondary">Yuborish</button>
    `;

    form2.addEventListener('submit', submit_edit_comment);
    return form2;
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
        return res.json();
    }).then(response => {
        return response;
    }).catch(error => {
    });
}




function formatNumber(val) {
    val = parseInt(val);
    let formatted = val.toLocaleString();

    formatted = formatted.replace(/,/g, ' ');

    return formatted;
}


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

