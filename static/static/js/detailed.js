

function upload_project_files(){
    console.log('working')
    document.getElementById('add-file-projects-form').addEventListener('submit',function (e){
        let form = e.target
        let formData = new FormData(form)
        let project_id = form.getAttribute('project_id')
        e.preventDefault()
            fetch(`add-project-files/${project_id}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': form.csrfmiddlewaretoken.value
        },
        body: formData,
    })
        .then(res => {
            location.reload()
            });
    })
}

try {
    upload_project_files()
}catch (e){

}


