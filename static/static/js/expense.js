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


function change_table() {
    document.querySelectorAll('.change-table').forEach(value => {
        value.addEventListener('change', function (e) {
            console.log('changed')
            let selectedId = value.selectedOptions[0].id;
            if (selectedId === 'blog') {
                document.querySelectorAll('.d_datas').forEach(el => el.style.display = 'none')
                document.querySelectorAll('.b_datas').forEach(el => el.style.display = '')
                document.getElementById('table-title').innerText = 'Loyihalar boklar kesimida'

            }

            if (selectedId === 'dept') {
                document.querySelectorAll('.d_datas').forEach(el => el.style.display = '')
                document.querySelectorAll('.b_datas').forEach(el => el.style.display = 'none')
                document.getElementById('table-title').innerText = 'Loyihalar departamentlar kesimida'
            }
        })
    })
}

change_table()
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

expandBudget()


function offcanvas_manager(){
    let btn = document.getElementById('expense-menu-toggle')
    btn.addEventListener('click',function (){
        let offcanvas = document.getElementById('expanse-container')
        offcanvas.classList.add('slide-in-right')
        setTimeout(()=>{
                    offcanvas.style.display = 'block'
            offcanvas.classList.add('visible')
            btn.style.zIndex = '-1'
        })
        document.getElementById('cancel-expense').addEventListener('click',function (){
            offcanvas.style.display = 'none'
            btn.style.zIndex = '1'

        })
    })
}

offcanvas_manager()

function formatNumber(val) {
    val = parseInt(val);
    let formatted = val.toLocaleString();

    formatted = formatted.replace(/,/g, ' ');

    return formatted;
}



function add_listeners() {
    var delete_expense_modal = document.getElementById('delete-expense-btn');
    var e_id

    document.querySelectorAll('.delete-expense').forEach(value => {
        value.addEventListener('click', function () {
            e_id = value.id

        })
    })
    var delete_expense_btn = document.getElementById('confirm-delete-expense-btn');
    delete_expense_btn.addEventListener('click', function () {
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
    })
}

add_listeners()

function redirecting() {
    document.querySelectorAll('.datas').forEach(value => {
        value.addEventListener('click', function () {
            window.location.href = value.getAttribute('data-url');
        })
    });
}

redirecting()




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

decreaseBudget()
function document_listen(){
    let file = document.getElementById('file')
                let input_file = file.files[0]
                let form = document.getElementById('add-expense')
            file.addEventListener('change',function () {
                let div = document.createElement('div')
                div.classList.add('form-group')
                div.innerHTML = `<label for="phase">Bu fayl qaysi fazaga tegishli:</label><input name="phase" class="form-control" type="text" id="phase"/>`
                let button = form.children.item(6)
                button.insertBefore(button,div)
            })
}

document_listen()


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
                    tbody.innerHTML += `
                <tr>
                    <td>${expense}</td>
                    <td>${formatNumber(response.quantity)}</td>
                    <td>${date}</td>
                    <td>
                        <i style="color: red; cursor: pointer" id="${response.id}" data-toggle="modal" data-target="#delete-expense-btn" class="fa-regular delete-expense fa-trash-can text-center"></i>
                    </td>
                </tr>
                <div id="delete-expense-btn" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
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
                    </div>
                </div>`;
                    add_listeners();
                    let total = response.spent_money;
                    let left = parseFloat(response.total_money.replace(/ /g, '')) - parseFloat(response.spent_money.replace(/ /g, ''));
                    document.getElementById('totalExpenses').textContent = formatNumber(total);
                    document.getElementById('budgetLeft').textContent = formatNumber(left);
                    document.getElementById('add-expense-cancel').click()
                }));
        }
    });
}

add_expense()


function deleteAll() {
    let button = document.getElementById('reset-all');
    let project_id = button.getAttribute('project_id')
    button.addEventListener('click', function () {
        fetch(`delete-expense-all/${project_id}`).then(res => {
            location.reload()
        })
    })
}

deleteAll()
add_listeners()