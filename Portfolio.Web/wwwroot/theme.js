(function () {
    const storageKey = 'portfolio-theme';
    const root = document.documentElement;

    function setTheme(theme) {
        root.dataset.theme = theme;
        localStorage.setItem(storageKey, theme);
    }

    function syncToggle(toggle) {
        const isDark = root.dataset.theme === 'dark';
        toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    function wireThemeToggle() {
        const toggle = document.getElementById('theme-toggle');

        if (!toggle) {
            return;
        }

        syncToggle(toggle);
        toggle.addEventListener('click', function (event) {
            event.stopPropagation();
            setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
            syncToggle(toggle);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireThemeToggle);
    } else {
        wireThemeToggle();
    }
}());
