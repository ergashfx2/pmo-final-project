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


