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

function formatNumber(val) {
    val = parseInt(val);
    let formatted = val.toLocaleString();

    formatted = formatted.replace(/,/g, ' ');

    return formatted;
}

function add_listeners() {
    var delete_expense_modal = document.getElementById('delete-expense-btn');
    var e_id
    console.log("listeners working")
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
                        delete_expense_modal.classList.remove('show');
                        delete_expense_modal.style.display = 'none';
                        document.body.classList.remove('modal-open');
                        document.querySelector('.modal-backdrop').remove();
                    })
                }
            }
        })
    })
}

add_listeners()

function change_table() {
    console.log('table working')
    document.querySelectorAll('.change-table').forEach(value => {
        value.addEventListener('change', function (e) {
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



document.getElementById('add-expense').addEventListener('submit', function (e) {
    e.preventDefault()
    let expense = document.getElementById('expense').value
    let amount = document.getElementById('amount').value
    let date = document.getElementById('date').value
    let p_id = e.target.classList[0];
    let file = document.getElementById('file')
    var input_file
    if (file.files[0]) {
        input_file = file.files[0]
    }
    let csrfToken = getCookie('csrftoken')
    let formData = new FormData()
    let data = {'expense': expense, 'amount': amount, 'date': date, 'file': file.files[0]}
    formData.append('file', input_file)
    formData.append('data', JSON.stringify(data))
    if (expense) {
        console.log(input_file)
        fetch(`add-expense/${p_id}`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: formData,
        }).then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    console.log(response)
                    let tbody = document.getElementById('expenses-body')
                    tbody.innerHTML = `${tbody.innerHTML} <tr class="text-center"><td class="text-center">${expense}</td><td class="text-center">${amount}</td><td class="text-center">${date}</td> <td class="text-center"><i style="color: red;cursor: pointer" id="${response.id}" data-toggle="modal" data-target="#delete-expense-btn" class="fa-regular delete-expense fa-trash-can text-center"></i></td></tr><div id="delete-expense-btn"
                                                                                         class="modal fade"
                                                                                         tabindex="-1" role="dialog"
                                                                                         aria-hidden="true">
                                                                                        <div class="modal-dialog modal-sm modal-dialog-centered"
                                                                                             role="document">
                                                                                            <div class="modal-content">
                                                                                                <div class="modal-body text-center">
                                                                                                    <i class="fa-solid fa-triangle-exclamation btn-lg" style="font-size: 5dvh"></i>
                                                                                                    <h4>Chindan o'chirasizmi ?</h4></div>
                                                                                                <div class="d-flex justify-content-center mb-2">
                                                                                                    <button id="confirm-delete-expense-btn" class="btn btn-danger mr-2"><i class="fa-solid fa-trash-can"></i> O'chirish</button>
                                                                                                    <button class="btn btn-secondary" data-dismiss="modal">Bekor qilish</button>
                                                                                                    <br>
                                                                                                </div>
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>`
                    add_listeners()
                    var total = response.spent_money
                    var left = response.total_money.replaceAll(' ', '') - response.spent_money.replaceAll(' ', '')
                    document.getElementById('totalExpenses').textContent = `${formatNumber(total)}`
                    document.getElementById('budgetLeft').textContent = `${formatNumber(left)}`
                })
            } else {
                alert("error occured")
            }
        })
    }
})

