const themes = ["", "dark-theme", "cream-theme"];
let currentTheme = localStorage.getItem("theme") || "";

// Initialize theme
if (currentTheme) {
    document.body.classList.add(currentTheme);
}

document.addEventListener("DOMContentLoaded", () => {
    // Global Theme Toggle
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
        themeBtn.onclick = () => {
            document.body.classList.remove(...themes.filter(t => t !== ""));
            let idx = themes.indexOf(currentTheme);
            currentTheme = themes[(idx + 1) % themes.length];

            if (currentTheme) document.body.classList.add(currentTheme);
            localStorage.setItem("theme", currentTheme);

            // Re-render charts
            window.dispatchEvent(new Event('themeChanged'));
        };
    }

    // Global Sidebar Toggle
    const toggle = document.getElementById("toggle");
    const sidebar = document.querySelector(".sidebar");

    if (toggle && sidebar) {
        // Load persisted state
        if (localStorage.getItem("sidebarCollapsed") === "true") {
            sidebar.classList.add("collapsed");
        }

        toggle.onclick = () => {
            sidebar.classList.toggle("collapsed");
            // For mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle("active");
            }
            localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));

            // Give Plotly a moment to resize
            setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
        };
    }

    // Auto-close sidebar on mobile overlay click
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            e.target !== toggle &&
            !toggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Ripple click animation loader
    document.addEventListener('click', function (e) {
        const target = e.target.closest('.ripple-btn, .menu-item, button, .card');
        if (!target) return;

        const circle = document.createElement('span');
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');

        const ripple = target.querySelector('.ripple');
        if (ripple) ripple.remove();

        // Ensure relative positioning
        if (getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
        }
        if (getComputedStyle(target).overflow !== 'hidden') {
            target.style.overflow = 'hidden';
        }

        target.appendChild(circle);
    });
});
