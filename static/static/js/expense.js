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


function sendPostRequest(url, data) {
    return new Promise((resolve, reject) => {
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
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}



function expandBudget() {
    document.getElementById('budget-expand-btn').addEventListener('click', function () {
        console.log('clicked')
        var budget = document.getElementById('budget');
        var res = sendPostRequest(`expand-budget/${budget.classList[1]}`, {'data': budget.value})
        res.then(res => {
            var total = res.spent_money
            var left = res.total_money - res.spent_money
            document.getElementById('totalExpenses').textContent = `${formatNumber(total)}`
            document.getElementById('totalBudget').textContent = `${formatNumber(res.total_money)}`
            document.getElementById('budgetLeft').textContent = `${formatNumber(left)}`
            document.getElementById('budget-expand-cancel').click()
        })
    })
}


try {
    expandBudget()
} catch (e) {

}


function offcanvas_manager() {
    let btn = document.getElementById('expense-menu-toggle')
    btn.addEventListener('click', function () {
        let offcanvas = document.getElementById('expanse-container')
        offcanvas.classList.add('slide-in-right')
        setTimeout(() => {
            offcanvas.style.display = 'block'
            offcanvas.classList.add('visible')
            btn.style.zIndex = '-1'
        })
        document.getElementById('cancel-expense').addEventListener('click', function () {
            offcanvas.style.display = 'none'
            btn.style.zIndex = '1'

        })
    })
}


try {
    offcanvas_manager()
} catch (e) {

}

function formatNumber(val) {
    val = parseInt(val);
    let formatted = val.toLocaleString();

    formatted = formatted.replace(/,/g, ' ');

    return formatted;
}


var e_id

function add_listeners() {
    var delete_expense_modal = document.getElementById('delete-expense-btn');

    document.querySelectorAll('.delete-expense').forEach(value => {
        value.addEventListener('click', detect_eid)
    })
    var delete_expense_btn = document.getElementById('confirm-delete-expense-btn');
    delete_expense_btn.addEventListener('click', delete_expense)
}

function detect_eid(e) {
    e_id = e.target.id

}


function delete_expense(e) {
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
                    document.getElementById('cancel-expense-btn').click()
                })
            }
        }
    })
}

function redirecting() {
    const tbody = document.getElementById('projects-body');
    const datas = document.querySelectorAll('.datas');
    datas.forEach((value, index) => {
        if (index === datas.length - 1) return;
        for (let i = 0; i < value.children.length ; i++) {
            if (i === value.children.length-1 ) return;
                 value.children.item(i).addEventListener('click', redirect);
        }
    });
}

function redirect(e) {
            window.location.href = e.target.getAttribute('data-url');
        }





try {
    redirecting()
} catch (e) {

}


function decreaseBudget() {
    document.getElementById('budget-decrease-btn').addEventListener('click', function () {
        var budget = document.getElementById('budget');
        var res = sendPostRequest(`decrease-budget/${budget.classList[1]}`, {'data': budget.value})
        res.then(res => {
            var total = res.spent_money
            var left = res.total_money - res.spent_money
            document.getElementById('totalExpenses').textContent = `${formatNumber(total)}`
            document.getElementById('totalBudget').textContent = `${formatNumber(res.total_money)}`
            document.getElementById('budgetLeft').textContent = `${formatNumber(left)}`
            document.getElementById('budget-decrease-cancel').click()
        })
    })
}


try {
    decreaseBudget()
} catch (e) {

}

function document_listen() {
    let file = document.getElementById('file')
    let input_file = file.files[0]
    let form = document.getElementById('add-expense')
    file.addEventListener('change', function () {
        let div = document.createElement('div')
        div.classList.add('form-group')
        div.innerHTML = `<label for="phase">Bu fayl qaysi fazaga tegishli:</label><input name="phase" class="form-control" type="text" id="phase"/>`
        let child = document.querySelector('#add-expense > button.btn.btn-primary.form-control')
        document.getElementById('add-expense').insertBefore(div, child)
    })
}


try {
    document_listen()
} catch (e) {

}


function add_expense() {
    document.getElementById('add-expense-button').addEventListener('click', function (e) {
        let expense = document.getElementById('expense').value;
        let amount = document.getElementById('amount').value;
        let date = document.getElementById('date').value;
        let p_id = document.getElementById('add-expense').classList[0];
        let file = document.getElementById('file');
        let currency = document.querySelector('input[name="currency"]:checked').value;
        let input_file = file.files[0] || null;
        let csrfToken = getCookie('csrftoken');
        let formData = new FormData();
        let data = {'expense': expense, 'amount': amount, 'date': date, 'file': input_file, 'currency': currency};
        formData.append('file', input_file);
        formData.append('data', JSON.stringify(data));

        if (expense) {
            fetch(`add-expense/${p_id}`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: formData,
            })
                .then(res => res.json().then(response => {
                    let tbody = document.getElementById('expenses-body');
                    console.log(response)
                    let tr = document.createElement('tr')
                    tr.innerHTML = `
                    <td>${expense}</td>
                    <td>${formatNumber(response.quantity)}</td>
                    <td>${date}</td>
                    <td>
                        <i style="color: red; cursor: pointer" id="${response.id}" data-toggle="modal" data-target="#delete-expense-btn" class="fa-regular delete-expense fa-trash-can text-center"></i>
                    </td>`
                    let div = document.createElement('div')
                    div.id = 'delete-expense-btn'
                    div.classList.add('modal', 'fade')
                    div.tabIndex = '-1'
                    div.role = 'dialog'
                    div.ariaHidden = true
                    div.innerHTML = `
                    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-body text-center">
                                <i class="fa-solid fa-triangle-exclamation btn-lg" style="font-size: 5dvh"></i>
                                <h4>Chindan o'chirasizmi ?</h4>
                            </div>
                            <div class="d-flex justify-content-center mb-2">
                                <button id="confirm-delete-expense-btn" class="btn btn-danger mr-2">
                                    <i class="fa-solid fa-trash-can"></i> O'chirish
                                </button>
                                <button class="btn btn-secondary" data-dismiss="modal">Bekor qilish</button>
                            </div>
                        </div>
                    </div>`
                    tbody.appendChild(tr)
                    tbody.appendChild(div)
                    tr.lastChild.addEventListener('click', detect_eid)
                    let btn = div.children.item(0).children.item(0).children.item(1).children.item(0)
                    btn.addEventListener('click', delete_expense)
                    let total = response.spent_money;
                    let left = parseFloat(response.total_money.replace(/ /g, '')) - parseFloat(response.spent_money.replace(/ /g, ''));
                    document.getElementById('totalExpenses').textContent = formatNumber(total);
                    document.getElementById('budgetLeft').textContent = formatNumber(left);
                    document.getElementById('add-expense-cancel').click()
                }));
        }
    });
}


try {
    add_expense()
} catch (e) {

}


function deleteAll() {
    let button = document.getElementById('reset-all');
    let project_id = button.getAttribute('project_id')
    button.addEventListener('click', function () {
        fetch(`delete-expense-all/${project_id}`).then(res => {
            location.reload()
        })
    })
}


try {
    deleteAll()
    add_listeners()
} catch (e) {

}

function download_file_listener() {
    document.querySelectorAll('.expense_files').forEach(value => {
        value.addEventListener('click', downloadFile_expense)
    })
}

try {
    download_file_listener()
} catch (e) {

}


function downloadFile_expense(e) {
    let expense_id = e.target.getAttribute('expense_id')
    const downloadUrl = `download-file/${expense_id}`;

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

        });
}

function search() {
    document.querySelectorAll('.search').forEach(value => {
        console.log('Working')
        let expenses_all = []
        let expenses_filtered = []
        const ProxyArr = (arr, fn) => new Proxy(arr, {
            get: (arr, key) => arr[key],
            set: (arr, key, val) => fn(arr[key] = val, key, arr) || 1
        });
        let handler = (arr) => {
            document.getElementById('expenses-body').querySelectorAll('tr').forEach(tr => {
                tr.querySelectorAll('td').forEach(td => {
                    let search = document.getElementById('search-expense')
                    if (td.id === 'expense_name' && !td.textContent.toLowerCase().trim().startsWith(search.value.toLowerCase())) {
                        tr.style.display = 'none'
                    }
                })
            })
        };
        let proxy = ProxyArr(expenses_filtered, handler);
        let body = document.getElementById('expenses-body')
        value.addEventListener('input', function (e) {
            console.log('working')
            if (e.target.value.length === 0) {
                document.getElementById('expenses-body').querySelectorAll('tr').forEach(value => value.style.display = 'table-row')

            }
            for (const expense in expenses_list) {
                let expense_arr = expenses_list[expense].fields
                expenses_all.push(expense_arr)
                if (expense_arr.description.toLowerCase().startsWith(e.target.value.toLowerCase())) {
                    proxy.push(expense_arr)
                }
            }
        })
    })
}

try {
    search()
} catch (e) {

}

function return_bg_color(status){
    let colors = {'Yangi':"bg-light","Jarayonda":'bg-warning','Tugatilgan':"bg-success"}
    let badge = {'Yangi':"badge-info","Jarayonda":'badge-warning','Tugatilgan':"badge-success"}
    return [colors[status],badge[status]]
}

function search_project() {
    document.querySelectorAll('.search-projects').forEach(input => {
        const projects_filtered = [];
        const initial_tbody = document.getElementById('projects-body').innerHTML;
        const table = document.getElementById('projects-body');
        const cloned_tr = table.children.item(1).cloneNode(true);

        const updateTable = () => {
            const tbody = document.getElementById('projects-body');
            tbody.innerHTML = '';

            projects_filtered.forEach((project, index) => {
                const new_cloned_tr = cloned_tr.cloneNode(true);
                new_cloned_tr.children.item(0).innerText = index + 1;
                new_cloned_tr.children.item(1).innerText = project.project_name;
                new_cloned_tr.children.item(2).innerText = project.project_description;
                new_cloned_tr.children.item(3).innerText = project.project_departments;
                new_cloned_tr.children.item(4).innerText = project.project_budget;
                new_cloned_tr.children.item(5).innerText = project.project_curator;
                                    let bg = return_bg_color(project.project_status);
                    new_cloned_tr.children.item(6).children.item(0).children.item(0).classList.add(bg[0]);
                    new_cloned_tr.children.item(6).children.item(0).children.item(0).setAttribute('aria-valuenow', project.project_done_percentage);
                    new_cloned_tr.children.item(6).children.item(0).children.item(0).style.width = project.project_done_percentage + '%';
                    new_cloned_tr.children.item(6).children.item(1).innerText = project.project_done_percentage + '%';
                    new_cloned_tr.children.item(6).children.item(2).removeAttribute('class');
                    new_cloned_tr.children.item(6).children.item(2).classList.add('badge', bg[1]);
                    new_cloned_tr.children.item(6).children.item(2).innerText = `${project.project_status}`;
                if (window.location.href.includes('my-projects')) {
                    console.log('working')
                    new_cloned_tr.children.item(7).children.item(0).children.item(0).children.item(0).href = `/projects/my-projects/detail/${project.project_id}`;
                    new_cloned_tr.children.item(7).children.item(0).children.item(1).children.item(0).href = `/projects/my-projects/edit/${project.project_id}`;
                    console.log(new_cloned_tr.children.item(7).children.item(0).children.item(2).children.item(0).id = project.project_id);
                }
                tbody.appendChild(new_cloned_tr);
            });
        };

        const proxyHandler = {
            set(target, key, value) {
                target[key] = value;
                updateTable();
                return true;
            }
        };

        const proxy = new Proxy(projects_filtered, proxyHandler);

        input.addEventListener('input', (e) => {
            projects_filtered.length = 0;

            if (e.target.value.length === 0) {
                document.getElementById('projects-body').innerHTML = initial_tbody;
            } else {
                projects_serialized.forEach(project => {
                    const projectData = project.fields;
                    if (projectData.project_name.toLowerCase().includes(e.target.value.toLowerCase())) {
                        proxy.push(projectData);
                    }
                });
            }
        });
    });
}


try {
    search_project()
} catch (e) {

}

function filter_all_projects() {
    let projects_all = []
                        const table = document.getElementById('projects-body');
        const cloned_tr = table.children.item(1).cloneNode(true);
    document.getElementById('filter-all-projects').addEventListener('change', function (e) {
        projects_all = []
        console.log(cloned_tr)
        console.log(projects_all)
        fetch(`filter/${e.target.value}`).then(res => res.json().then(res => {
            let projects = res.projects
            projects = JSON.parse(projects)
            for (const project in projects) {
                projects[project]['fields']['project_id'] = projects[project]['pk']
                projects_all.push(projects[project]['fields'])
            }
            let tbody = document.getElementById('projects-body')
            tbody.innerHTML = ``
            projects_all.forEach((project,index)=>{
                let new_cloned_tr = cloned_tr.cloneNode(true);
                new_cloned_tr.children.item(0).innerText = index + 1;
                new_cloned_tr.children.item(1).innerText = project.project_name;
                new_cloned_tr.children.item(2).innerText = project.project_description;
                new_cloned_tr.children.item(3).innerText = project.project_departments;
                new_cloned_tr.children.item(4).innerText = project.project_budget;
                new_cloned_tr.children.item(5).innerText = project.project_curator;
                let bg = return_bg_color(project.project_status);
                new_cloned_tr.children.item(6).children.item(0).children.item(0).classList.add(bg[0]);
                new_cloned_tr.children.item(6).children.item(0).children.item(0).setAttribute('aria-valuenow', project.project_done_percentage);
                new_cloned_tr.children.item(6).children.item(0).children.item(0).style.width = project.project_done_percentage + '%';
                new_cloned_tr.children.item(6).children.item(1).innerText = project.project_done_percentage + '%';
                new_cloned_tr.children.item(6).children.item(2).removeAttribute('class');
                new_cloned_tr.children.item(6).children.item(2).classList.add('badge', bg[1]);
                new_cloned_tr.children.item(6).children.item(2).innerText = `${project.project_status}`;
            tbody.appendChild(new_cloned_tr)
            })


        }))
    })
}

try {
    filter_all_projects()
} catch (e) {

}