// Toggle Sidebar
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleButton = document.getElementById('toggleSidebar');

toggleButton.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
});

// Initialize on mobile devices
function checkScreenSize() {
    if (window.innerWidth < 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }
}

// Check on initial load
checkScreenSize();

// Check on resize
window.addEventListener('resize', checkScreenSize);