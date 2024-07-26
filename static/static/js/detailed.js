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

document.addEventListener('DOMContentLoaded',function (){
        document.querySelectorAll('.p-files').forEach(value => {
        value.addEventListener('click', function () {
            downloadFile(value.id)
        })
    })
})

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

function action_manager() {
    document.querySelectorAll('.actions-btn').forEach(value => {
        value.addEventListener('click', actions_btn)
    })
}

action_manager()

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


function download_all() {
    document.querySelectorAll('.archive-btn').forEach(value => {
        value.addEventListener('click', function () {
            downloadArchive(value.getAttribute('phase_id'))
        })
    })
}

download_all()





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


