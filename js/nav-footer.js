/**
 * Load shared header and footer, then init nav (dropdowns, mobile menu).
 * - Header: fetches includes/header.html and injects it into #site-header (full nav; CSS makes it display correctly).
 * - Footer: injects includes/footer.html into #site-footer.
 * Usage: Put <div id="site-header"></div> and <div id="site-footer"></div> on each page, then <script src="js/nav-footer.js"></script>
 */
(function () {
    var headerEl = document.getElementById('site-header');
    var footerEl = document.getElementById('site-footer');
    var COOKIE_CONSENT_KEY = 'zann_cookie_consent';

    function getCookieValue(name) {
        var escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : '';
    }

    function getConsentValue() {
        try {
            var local = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (local) return local;
        } catch (e) { /* ignore */ }
        return getCookieValue(COOKIE_CONSENT_KEY);
    }

    function saveConsentValue(value) {
        try {
            localStorage.setItem(COOKIE_CONSENT_KEY, value);
        } catch (e) { /* ignore */ }
        document.cookie = COOKIE_CONSENT_KEY + '=' + encodeURIComponent(value) + '; path=/; max-age=31536000; SameSite=Lax';
        document.documentElement.setAttribute('data-cookie-consent', value);
    }

    function ensureCookieStyles() {
        if (document.getElementById('cookie-consent-styles')) return;
        var style = document.createElement('style');
        style.id = 'cookie-consent-styles';
        style.textContent = [
            '.cookie-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:220;background:linear-gradient(145deg,rgba(230,245,249,.98),rgba(219,238,244,.96));color:#4b4f52;border:1px solid rgba(122,154,159,.28);border-radius:16px;padding:16px 16px 14px;box-shadow:0 16px 36px rgba(43,61,66,.16);transform:translateY(16px);opacity:0;pointer-events:none;transition:opacity .25s ease,transform .25s ease;overflow:hidden;}',
            '.cookie-consent::before{content:"";position:absolute;inset:-1px;background:radial-gradient(ellipse 55% 80% at 0% 0%,rgba(197,225,232,.55) 0%,transparent 62%),radial-gradient(ellipse 45% 70% at 100% 100%,rgba(199,224,217,.5) 0%,transparent 60%);pointer-events:none;}',
            '.cookie-consent > *{position:relative;z-index:1;}',
            '.cookie-consent.is-visible{opacity:1;transform:translateY(0);pointer-events:auto;}',
            '.cookie-consent__title{font-size:16px;font-weight:700;text-transform:lowercase;letter-spacing:.01em;margin:0 0 6px;color:#545658;}',
            '.cookie-consent__text{font-size:14px;line-height:1.5;color:#636466;margin:0 0 12px;}',
            '.cookie-consent__actions{display:flex;flex-wrap:wrap;gap:8px;}',
            '.cookie-consent__btn{appearance:none;border-radius:10px;padding:9px 13px;border:1px solid rgba(84,86,88,.26);background:#fff;color:#545658;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s ease;}',
            '.cookie-consent__btn--accept{background:#545658;color:#fff;border-color:#545658;}',
            '.cookie-consent__btn:hover{transform:translateY(-1px);filter:brightness(1.02);}',
            '.cookie-consent__meta{font-size:12px;color:#636466;margin:10px 0 0;}',
            '@media (min-width:768px){.cookie-consent{left:auto;right:24px;bottom:24px;max-width:500px;}}'
        ].join('');
        document.head.appendChild(style);
    }

    function closeCookieBanner() {
        var banner = document.getElementById('cookie-consent');
        if (!banner) return;
        banner.classList.remove('is-visible');
        banner.setAttribute('aria-hidden', 'true');
    }

    function openCookieBanner() {
        ensureCookieStyles();
        var banner = document.getElementById('cookie-consent');
        if (!banner) {
            banner = document.createElement('section');
            banner.id = 'cookie-consent';
            banner.className = 'cookie-consent';
            banner.setAttribute('role', 'dialog');
            banner.setAttribute('aria-live', 'polite');
            banner.setAttribute('aria-label', 'Cookie preferences');
            banner.innerHTML = [
                '<p class="cookie-consent__title">cookie preferences</p>',
                '<p class="cookie-consent__text">We use cookies to improve website performance and your browsing experience. You can accept or decline optional cookies.</p>',
                '<div class="cookie-consent__actions">',
                '  <button type="button" class="cookie-consent__btn cookie-consent__btn--accept" data-cookie-choice="accepted">Accept</button>',
                '  <button type="button" class="cookie-consent__btn" data-cookie-choice="rejected">Decline</button>',
                '</div>',
                '<p class="cookie-consent__meta">You can reopen this anytime from <strong>Cookie settings</strong> in the footer.</p>'
            ].join('');
            document.body.appendChild(banner);
            banner.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-cookie-choice]');
                if (!btn) return;
                saveConsentValue(btn.getAttribute('data-cookie-choice'));
                closeCookieBanner();
            });
        }
        banner.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(function () {
            banner.classList.add('is-visible');
        });
    }

    function initCookieConsent() {
        var consent = getConsentValue();
        if (consent === 'accepted' || consent === 'rejected') {
            document.documentElement.setAttribute('data-cookie-consent', consent);
            return;
        }
        openCookieBanner();
    }

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

    // Show consent banner immediately on initial page open.
    initCookieConsent();

    if (headerEl || footerEl) {
        loadAndInit();
    } else {
        initNav();
    }

    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-cookie-settings]');
        if (!trigger) return;
        e.preventDefault();
        openCookieBanner();
    });
})();
