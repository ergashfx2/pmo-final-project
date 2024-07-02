
    $(document).ready(function() {
        $('[data-toggle="offcanvas"]').click(function() {
            var target = $(this).data('target');
            $(target).toggleClass('show');
        });

        $('.offcanvas .close').click(function() {
            $(this).closest('.offcanvas').removeClass('show');
        });
    });