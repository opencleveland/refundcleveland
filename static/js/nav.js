(function () {

    // options
    const sticky = false; // fixed header on scroll
    const scrollOffset = 75; // vertical offset in px -- when sticky class is added

    // dom elements
    const header = document.getElementById('masthead');
    const button = document.getElementById('masthead__button');
    const mobile_menu = document.getElementById('mobile_menu'); // ul element

    if (!header || !button) {
        return;
    }

    if (!mobile_menu) {
        button.style.display = 'none';
        return;
    }

    // start with closed menu
    header.classList.add('collapsed');
    var headerHeight;
    mobile_menu.style.height = 0 + 'px';

    // toggle menu open/closed
    button.onclick = function () {

        // expand
        if (header.classList.contains('collapsed')) {
            header.classList.remove('collapsed');
            header.classList.add('expanded');
            headerHeight = mobile_menu.scrollHeight;
            mobile_menu.style.height = headerHeight + 'px';
            // collapse
        } else {
            header.classList.remove('expanded');
            header.classList.add('collapsed');
            mobile_menu.style.height = 0 + 'px';
        }
    }

    // add `fixed` class on scroll
    if (sticky === true) {
        window.onscroll = function () {
            var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop

            if (scrollTop > scrollOffset) {
                header.classList.add('fixed');
            } else {
                header.classList.remove('fixed');
            }
        }
    }

})();