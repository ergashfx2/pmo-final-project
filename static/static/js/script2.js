function delete_project(){
    var p_id
    document.querySelectorAll('.delete-button').forEach(value => {
        value.addEventListener('click',function (){
            p_id = value.id
        })
    })
    document.getElementById('confirm-delete-project').addEventListener('click',function (){
        fetch(`delete/${p_id}`).then(res=>{
            document.getElementById('cancel-delete-project').click()
            location.reload()
        })
    })
}

try {
    delete_project()
}catch (e){

}

