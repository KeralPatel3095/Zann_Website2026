/**
 * Load shared header and footer, then init nav (dropdowns, mobile menu).
 * - Header: fetches includes/header.html and injects it into #site-header (full nav; CSS makes it display correctly).
 * - Footer: injects includes/footer.html into #site-footer.
 * Usage: Put <div id="site-header"></div> and <div id="site-footer"></div> on each page, then <script src="js/nav-footer.js"></script>
 */
(function () {
    var headerEl = document.getElementById('site-header');
    var footerEl = document.getElementById('site-footer');

    function initNav() {
        var header = document.querySelector('.header');
        var navToggle = document.querySelector('.nav-toggle');
        var navOverlay = document.querySelector('.nav-overlay');
        var navItems = document.querySelectorAll('.nav-item.has-dropdown');
        var navToggles = document.querySelectorAll('.nav-link-toggle');
        var expandButtons = document.querySelectorAll('.dropdown-expand');

        function closeMobileNav() {
            if (header) header.classList.remove('nav-open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            navItems.forEach(function (n) { n.classList.remove('dropdown-open'); });
            document.body.style.overflow = '';
        }
        function openMobileNav() {
            if (header) header.classList.add('nav-open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
            if (document.querySelector('.nav-item.dropdown-open')) document.body.style.overflow = 'hidden';
        }

        if (navToggle) navToggle.addEventListener('click', function () {
            var isOpen = header && header.classList.contains('nav-open');
            if (isOpen) closeMobileNav(); else openMobileNav();
        });
        if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);
        document.querySelectorAll('.nav-link:not(.nav-link-toggle)').forEach(function (link) {
            link.addEventListener('click', function () { closeMobileNav(); });
        });

        navToggles.forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                var item = toggle.closest('.nav-item');
                var isOpen = item && item.classList.contains('dropdown-open');
                navItems.forEach(function (n) { n.classList.remove('dropdown-open'); });
                if (!isOpen && item) item.classList.add('dropdown-open');
                document.body.style.overflow = document.querySelector('.nav-item.dropdown-open') ? 'hidden' : '';
            });
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.nav-item.has-dropdown')) {
                navItems.forEach(function (n) { n.classList.remove('dropdown-open'); });
                document.body.style.overflow = '';
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;
            closeMobileNav();
            navItems.forEach(function (n) { n.classList.remove('dropdown-open'); });
            document.body.style.overflow = '';
        });

        expandButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var block = btn.closest('.dropdown-block');
                var sublinks = block ? block.querySelector('.dropdown-sublinks') : null;
                var isOpen = btn.classList.contains('expanded');
                if (sublinks) {
                    btn.classList.toggle('expanded', !isOpen);
                    sublinks.classList.toggle('expanded', !isOpen);
                }
            });
        });
    }

    function loadAndInit() {
        Promise.all([
            fetch('includes/header.html').then(function (r) { return r.text(); }),
            fetch('includes/footer.html').then(function (r) { return r.text(); })
        ]).then(function (results) {
            if (headerEl && results[0]) {
                headerEl.innerHTML = results[0].trim();
            }
            if (footerEl && results[1]) footerEl.innerHTML = results[1];
            initNav();
        }).catch(function () {
            initNav();
        });
    }

    if (headerEl || footerEl) {
        loadAndInit();
    } else {
        initNav();
    }
})();
