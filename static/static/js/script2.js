function delete_project(){
    var p_id
    document.querySelectorAll('.delete-button').forEach(value => {
        value.addEventListener('click',function (){
            p_id = value.id
            console.log('clicked')
        })
    })
    document.getElementById('confirm-delete-project').addEventListener('click',function (){
        fetch(`delete/${p_id}`).then(res=>{
            document.getElementById('cancel-delete-project').click()
            location.reload()
        })
    })
}

delete_project()