(function () {
    const storageKey = 'portfolio-theme';
    const root = document.documentElement;

    function preferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function storedTheme() {
        return localStorage.getItem(storageKey);
    }

    function currentTheme() {
        return root.dataset.theme || storedTheme() || preferredTheme();
    }

    function setTheme(theme) {
        root.dataset.theme = theme;
        localStorage.setItem(storageKey, theme);
        syncThemeToggles();
    }

    function applyCurrentTheme() {
        root.dataset.theme = currentTheme();
    }

    function syncThemeToggles() {
        applyCurrentTheme();

        const isDark = currentTheme() === 'dark';

        document.querySelectorAll('[data-theme-toggle]').forEach(function (toggle) {
            toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        });
    }

    function observePageChanges() {
        let queued = false;

        const observer = new MutationObserver(function () {
            if (queued) {
                return;
            }

            queued = true;
            requestAnimationFrame(function () {
                queued = false;
                syncThemeToggles();
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('click', function (event) {
        const toggle = event.target.closest('[data-theme-toggle]');

        if (!toggle) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        applyCurrentTheme();
        setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });

    document.addEventListener('DOMContentLoaded', function () {
        syncThemeToggles();
        observePageChanges();
    });
    document.addEventListener('enhancedload', syncThemeToggles);
    syncThemeToggles();
}());
