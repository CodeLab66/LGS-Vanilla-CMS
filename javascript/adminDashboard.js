// Combined admin.js and adminDashboard.js functionality

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality from admin.js
    const toggleButton = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Check if sidebar is already collapsed on page load (for mobile view)
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
    
    // Toggle sidebar on button click
    if (toggleButton && sidebar && mainContent) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else if (window.innerWidth > 768 && !sidebar.classList.contains('manually-collapsed')) {
            // Only expand if not manually collapsed
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    });
    
    // Mark sidebar as manually collapsed when toggle button is clicked
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('manually-collapsed');
            } else {
                sidebar.classList.remove('manually-collapsed');
            }
        });
    }

    // Navigation functionality from adminDashboard.js
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you would typically handle page navigation or content loading
            const navText = this.querySelector('.nav-text');
            if (navText) {
                const pageName = navText.textContent;
                console.log(`Navigating to ${pageName}`);
                // Implement actual navigation or content loading here
            }
        });
    });
    
    // Initialize any charts or data visualizations
    initializeCharts();
    
    // Load initial data
    loadDashboardData();
});

// Function to initialize charts (placeholder)
function initializeCharts() {
    console.log('Charts initialized');
    // Implement chart initialization here if you have charts
}

// Function to load dashboard data (placeholder)
function loadDashboardData() {
    console.log('Dashboard data loaded');
    // Implement data loading functionality here
}