document.addEventListener('DOMContentLoaded', function () {
        var toggleButton = document.querySelector('[data-toggle="offcanvas"]');
        var offcanvasElement = document.querySelector(toggleButton.getAttribute('data-target'));
        var closeButton = offcanvasElement.querySelector('.close');

        toggleButton.addEventListener('click', function () {
            offcanvasElement.classList.toggle('show');
        });

        closeButton.addEventListener('click', function () {
            offcanvasElement.classList.remove('show');
        });
    });
