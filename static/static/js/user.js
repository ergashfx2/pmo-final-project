document.addEventListener('DOMContentLoaded', async function () {
    let action = {};
    let users_list = await get_users_list();

    async function get_users_list() {
        try {
            let res = await fetch('get_users/serialized/');
            let data = await res.json();
            return JSON.parse(data).map(user => user.fields);
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    function toolsManager() {
        document.querySelectorAll('.user-tools').forEach(tool => {
            tool.addEventListener('click', function (e) {
                action = {};
                action['action'] = e.target.getAttribute('action');
                action['user_id'] = e.target.getAttribute('user_id');
                console.log(action)
            });
        });
    }

    function actionsManager() {
        document.getElementById('confirm-action-users').addEventListener('click', function () {
            fetch(`${action['action']}/${action['user_id']}`).then(res => {
                location.reload()
            });
        });
    }

function search_user() {
    let users_table_body = document.getElementById('users_list_body');
    let copied_tr = users_table_body.children.item(0).cloneNode(true);
    let found_users = [];

    const proxyHandler = {
        set(target, key, value) {
            target[key] = value;
            return true;
        }
    };

    found_users = new Proxy(found_users, proxyHandler);

    document.getElementById('search-users').addEventListener('input', function (e) {
        users_table_body.innerHTML = '';
        let search_value = e.target.value;
        found_users.length = 0;

        let updated_users = get_including_users(users_list, search_value);
        updated_users.forEach(user => found_users.push(user));
        updateUsersTable(users_table_body, copied_tr, found_users);
    });
}

function get_including_users(users_list, user_searched) {
    return users_list.filter(user =>
        user.first_name.toLowerCase().includes(user_searched.toLowerCase()) ||
        user.last_name.toLowerCase().includes(user_searched.toLowerCase())
    );
}



function updateUsersTable(users_table_body, copied_tr, users) {
    users.forEach((user,index) => {
        let new_tr = copied_tr.cloneNode(true);
        new_tr.children[0].innerText = index + 1;
        new_tr.children[1].innerText = user.first_name + " " + user.last_name;
        new_tr.children[2].innerHTML = get_user_status(user.status);
        new_tr.children[3].innerText = user.role;
        new_tr.children[4].innerText = user.phone;
        new_tr.children[5].children.item(0).setAttribute('user_id',user.user_id)
        console.log(new_tr.children[5].children.item(0))
        let action = get_user_action(user.status)
        new_tr.children[5].children.item(1).setAttribute('user_id',user.user_id)
        new_tr.children[5].children.item(1).setAttribute('action',action)
        new_tr.setAttribute('data-url',`/users/profile/${user.user_id}`)
        users_table_body.appendChild(new_tr);
        redirecting()
        toolsManager()
    });
}


function get_user_action (status){
        let actions = {
            'Active': 'block',
            'Blocked': 'unblock'
        }
        return actions[status]
}



function get_user_status(status){
        let statuses = {
            'Active':`<i class="fa-solid fa-circle" data-toggle="tooltip" data-placement="top" title="Tooltip on top" style="color: green; margin-left: 10%;"></i>`,
            'Blocked':`<i class="fa-solid fa-circle" style="color: red; margin-left: 10%;"></i>`
        }
        return statuses[status]
}



    search_user();
    actionsManager();
    toolsManager();
});


function redirecting() {
    console.log('working redirect');
    const tbody = document.getElementById('users_list_body');
    tbody.removeEventListener('click', handleRedirect);
    tbody.addEventListener('click', handleRedirect);
}

function handleRedirect(e) {
    const target = e.target.closest('.datas');
    if (target) {
        const url = target.getAttribute('data-url');
        if (url) {
            window.location.href = url;
        }
    }
}


        redirecting()