// DOM Elements
const addStudentBtn = document.querySelector('.quick-actions .btn-primary');

// Update stats cards with real-time data
function updateStatsDisplay() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get latest students data
    const currentStudents = JSON.parse(localStorage.getItem('students')) || [];

    const newEnrollments = currentStudents.filter(student => {
        const enrollmentDate = new Date(student.enrollmentDate);
        return enrollmentDate.getMonth() === currentMonth && enrollmentDate.getFullYear() === currentYear;
    }).length;

    // Calculate real attendance and GPA
    const attendanceSum = currentStudents.reduce((sum, student) => {
        return sum + (student.attendance || 95); // Default to 95% if not set
    }, 0);

    const gpaSum = currentStudents.reduce((sum, student) => {
        return sum + (student.gpa || 3.5); // Default to 3.5 if not set
    }, 0);

    const stats = {
        totalStudents: currentStudents.length,
        newEnrollments: newEnrollments,
        averageAttendance: currentStudents.length ? (attendanceSum / currentStudents.length).toFixed(1) : 0,
        averageGPA: currentStudents.length ? (gpaSum / currentStudents.length).toFixed(2) : 0
    };

    localStorage.setItem('studentStats', JSON.stringify(stats));

    // Update UI with new stats
    const statCards = document.querySelectorAll('.stat-card');
    statCards[0].querySelector('.stat-value').textContent = stats.totalStudents;
    statCards[2].querySelector('.stat-value').textContent = stats.averageAttendance + '%';
    statCards[3].querySelector('.stat-value').textContent = stats.averageGPA + '%';
}

// Event listeners
addStudentBtn.addEventListener('click', () => {
    window.location.href = 'html/addStudent.html';
});

// Listen for storage events to sync data across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'students' || e.key === 'studentStats') {
        updateStatsDisplay();
    }
});

// Initial render
updateStatsDisplay();

// Refresh data periodically
setInterval(updateStatsDisplay, 30000); // Update every 30 seconds