document.querySelectorAll("input").forEach(value => {
    value.addEventListener('input', function () {
        redirecting()
    })
})

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
    document.querySelectorAll('.delete-expense').forEach(value => {

        value.addEventListener('click', detect_eid)
    })
    var delete_expense_btn = document.getElementById('confirm-delete-expense-btn');
    delete_expense_btn.addEventListener('click', delete_expense)
}

try {
    add_listeners()
} catch (e) {

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
    tbody.removeEventListener('click', handleRedirect);
    tbody.addEventListener('click', handleRedirect);
}

function handleRedirect(e) {
    const target = e.target.closest('.datas');
    const classes = e.target.classList;
    console.log(classes)
    if (target && !classes.contains('no-redirect')) {
        const url = target.getAttribute('data-url');
        if (url) {
            window.location.href = url;
        }
    }
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


function return_bg_color(status) {
    let colors = {'Yangi': "bg-light", "Jarayonda": 'bg-warning', 'Tugatilgan': "bg-success"}
    let badge = {'Yangi': "badge-info", "Jarayonda": 'badge-warning', 'Tugatilgan': "badge-success"}
    return [colors[status], badge[status]]
}

function search_project() {
    document.querySelectorAll('.search-projects').forEach(input => {
        const projects_filtered = [];
        const initial_tbody = document.getElementById('projects-body').innerHTML;
        const table = document.getElementById('projects-body');
        const cloned_tr = table.children.item(2).cloneNode(true);
        const updateTable = () => {
            let tbody = document.getElementById('projects-body');
            tbody.innerHTML = '';
            generate_results(projects_filtered, cloned_tr, tbody = tbody, input = input)
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
                    if (projectData.project_name.toLowerCase().includes(e.target.value.toLowerCase()) || projectData.project_number.toLowerCase().includes(e.target.value.toLowerCase())) {
                        proxy.push(projectData);
                    }
                });
            }
        });
    });
}


function generate_results(projects_filtered, cloned_tr, tbody, input) {
    console.log(input)
    projects_filtered.forEach((project, index) => {
        const new_cloned_tr = cloned_tr.cloneNode(true);
        new_cloned_tr.children.item(0).innerText = index + 1;
        new_cloned_tr.children.item(1).innerText = project.project_number;
        new_cloned_tr.children.item(2).innerText = project.project_name;
        new_cloned_tr.children.item(3).innerText = project.project_blog;
        new_cloned_tr.children.item(4).innerText = project.project_departments;
        new_cloned_tr.children.item(5).innerText = formatNumber(project.project_budget);
        new_cloned_tr.children.item(6).innerText = project.project_curator;
        let bg = return_bg_color(project.project_status);
        new_cloned_tr.children.item(7).children.item(0).children.item(0).classList.add(bg[0]);
        new_cloned_tr.children.item(7).children.item(0).children.item(0).setAttribute('aria-valuenow', project.project_done_percentage);
        new_cloned_tr.children.item(7).children.item(0).children.item(0).style.width = project.project_done_percentage + '%';
        new_cloned_tr.children.item(7).children.item(1).innerText = project.project_done_percentage + '%';
        new_cloned_tr.children.item(7).children.item(2).removeAttribute('class');
        new_cloned_tr.children.item(7).children.item(2).classList.add('badge', bg[1]);
        new_cloned_tr.children.item(7).children.item(2).innerText = `${project.project_status}`;
        if (window.location.href.includes('my-projects')) {
            new_cloned_tr.children.item(8).children.item(0).children.item(0).href = `detail/${project.project_id}`;
            new_cloned_tr.children.item(8).children.item(0).children.item(1).href = `edit/${project.project_id}`;
            new_cloned_tr.removeAttribute('data-url')
            new_cloned_tr.setAttribute('data-url', `detail/${project.project_id}`)
            new_cloned_tr.classList.add('datas')
            redirecting()
        }
        new_cloned_tr.classList.add('datas')
        let textToSearch = input.value
        textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let pattern = new RegExp(`${textToSearch}`, "gi");
        let children = new_cloned_tr.querySelectorAll('td')
        for (let i = 1; i < 3; i++) {
            children[i].innerHTML = children[i].textContent.replace(pattern, match => `<mark>${match}</mark>`);

        }
        tbody.appendChild(new_cloned_tr);
        redirecting()
    })
}

try {
    search_project()
} catch (e) {

}

function filter_all_projects() {
    let projects_all = [];
    const table = document.getElementById('projects-body');
    const clonedRow = table.children.item(1).cloneNode(true);

    document.getElementById('filter-all-projects').addEventListener('change', async function (e) {
        try {
            projects_all = [];
            const response = await fetch(`filter/${e.target.value}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const res = await response.json();
            const projects = JSON.parse(res.projects);

            projects.forEach(project => {
                project.fields.project_id = project.pk;
                projects_all.push(project.fields);
            });

            updateProjectTable(projects_all, clonedRow);

        } catch (error) {

        }
    });
}

function updateProjectTable(projects, clonedRow) {
    const tbody = document.getElementById('projects-body');
    tbody.innerHTML = '';

    projects.forEach((project, index) => {
        const newRow = clonedRow.cloneNode(true);
        newRow.children.item(0).innerText = index + 1;
        newRow.children.item(1).innerText = project.project_number;
        newRow.children.item(2).innerText = project.project_name;
        newRow.children.item(3).innerText = project.project_description;
        newRow.children.item(4).innerText = project.project_departments;
        newRow.children.item(5).innerText = project.project_budget;
        newRow.children.item(6).innerText = project.project_curator;

        const bg = return_bg_color(project.project_status);
        const progressElement = newRow.children.item(7).children.item(0).children.item(0);
        progressElement.classList.add(bg[0]);
        progressElement.setAttribute('aria-valuenow', project.project_done_percentage);
        progressElement.style.width = project.project_done_percentage + '%';

        newRow.children.item(7).children.item(1).innerText = project.project_done_percentage + '%';

        const statusElement = newRow.children.item(7).children.item(2);
        statusElement.removeAttribute('class');
        statusElement.classList.add('badge', bg[1]);
        statusElement.innerText = `${project.project_status}`;

        tbody.appendChild(newRow);
    });
}

try {
    filter_all_projects();
} catch (e) {
}


function search_expense() {
    document.querySelectorAll('.search-expense-input').forEach(value => {
        const expense_filtered = [];

        const initial_tbody = document.getElementById('expenses-body').innerHTML;
        const table = document.getElementById('expenses-body');
        const cloned_tr = table.children.item(1).cloneNode(true);
        const updateTable = () => {
            const tbody = document.getElementById('expenses-body');
            tbody.innerHTML = '';

            expense_filtered.forEach((expense, index) => {
                const new_cloned_tr = cloned_tr.cloneNode(true);
                new_cloned_tr.children.item(0).innerText = expense['fields'].description;
                new_cloned_tr.children.item(1).innerText = expense['fields'].quantity;
                new_cloned_tr.children.item(2).innerText = expense['fields'].date;
                new_cloned_tr.children.item(3).innerText = expense['fields'].document;
                new_cloned_tr.children.item(4).children.item(0).id = expense.pk;
                tbody.appendChild(new_cloned_tr);
                add_listeners()
            });
        };

        const proxyHandler = {
            set(target, key, value) {
                target[key] = value;
                updateTable();
                return true;
            }
        };
        const proxy = new Proxy(expense_filtered, proxyHandler);

        value.addEventListener('input', (e) => {
            expense_filtered.length = 0;
            if (e.target.value.length === 0) {
                document.getElementById('expenses-body').innerHTML = initial_tbody;
            } else {
                expenses_list.forEach(expense => {
                    const expenseData = expense.fields;
                    if (expenseData.description.toLowerCase().includes(e.target.value.toLowerCase())) {
                        proxy.push(expense);
                    }
                });
            }
        });
        value.addEventListener('input', function (e) {
        })
    })
}

try {
    search_expense()
} catch (e) {
}

try {
    search_project()
} catch (e) {

}


function search_projects_spendings() {
    console.log('working')
    document.getElementById('search-spendings-projects').addEventListener('input', function (e) {
        let table_body = document.getElementById('projects-body')
        filter_search_input(table_body.children.length, table_body, e.target.value)

    })
}


function filter_search_input(children_length, table_body, input) {
    for (let i = 0; i < children_length; i++) {
        if (!table_body.children.item(i).children.item(1).innerText.toLowerCase().includes(input.toLowerCase())) {
            table_body.children.item(i).style.display = 'none'
        } else {
            table_body.children.item(i).style.display = 'table-row'
        }

    }
}

try {
    search_projects_spendings()
} catch (e) {

}