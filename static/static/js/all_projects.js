document.addEventListener('DOMContentLoaded', function () {
        var toggleButton = document.querySelector('[data-toggle="offcanvas"]');
        var offcanvasElement = document.querySelector(toggleButton.getAttribute('data-target'));
        var closeButton = offcanvasElement.querySelector('.close_canvas');

toggleButton.addEventListener('click', function (event) {
    console.log('clicked');
    offcanvasElement.classList.add('show');
    event.stopPropagation();
    setTimeout(() => {
        document.addEventListener('click', function (e) {
            let canvas = document.getElementById('offcanvasRight');
            if (!canvas.contains(e.target)) {
                offcanvasElement.classList.remove('show');
            }
        }, { once: true });
    }, 0);
});


        closeButton.addEventListener('click', function () {
            offcanvasElement.classList.remove('show');
        });
        var cols = []
        var colNames = []
        var thead = ''
        var tbody = ''
        filters = document.querySelectorAll('.cols');
        filters.forEach(value => {
            value.addEventListener('change', function (e) {
                var checked = e.target.checked
                if (checked) {
                    console.log(value.parentNode.textContent.trim())
                    cols.push(value.parentNode.textContent.trim())
                    colNames.push(value.name)
                } else {
                    cols = cols.filter(item => item !== value.parentNode.textContent.trim());
                    colNames = colNames.filter(item => item !== value.name);
                }
            })
        })

        document.getElementById('apply-changes').addEventListener('click', function () {
             offcanvasElement.classList.remove('show');
            thead = ''
            tbody = ''
            cols.forEach(col => {
                thead += `<th>${col}</th>`

            })
            for (i = 0; i < projects_s.length; i++) {
                var tds = ''
                colNames.forEach(value => {
                    tds += `<td><a href=${window.location.pathname.replace('all',projects_s[i].pk)} style="color:#000;">${projects_s[i].fields[value]}</a></td>`
                })
                tbody += `<tr>${tds}</tr>`
            }
            document.getElementById('table-projects').innerHTML = `<thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody>`
        })
    });