// DOM Elements
const nameSearchInput = document.getElementById('nameSearch');
const idSearchInput = document.getElementById('idSearch');
const classFilter = document.getElementById('classFilter');
const sectionFilter = document.getElementById('sectionFilter');
const addStudentBtn = document.getElementById('addStudentBtn');
const tableBody = document.querySelector('.data-table tbody');
const paginationContainer = document.querySelector('.pagination');

// Listen for changes in localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'students') {
        students = JSON.parse(e.newValue || '[]');
        displayStudents();
        updateStatsDisplay();
    }
});

// Pagination settings
const studentsPerPage = 10;
let currentPage = 1;

// Get students from localStorage or use sample data
// Get students from localStorage or use sample data
let students = JSON.parse(localStorage.getItem('students')) || [
    { id: 'STD001', name: 'Muhammad Bilal', class: 'Inter Part-II', section: 'A', contact: '+92 300 1234567', status: 'active', enrollmentDate: '2024-01-15' },
    { id: 'STD002', name: 'Muhammad Ali', class: 'Inter Part-I', section: 'B', contact: '+92 300 1234767', status: 'active', enrollmentDate: '2024-02-01' },
    { id: 'STD003', name: 'Ayesha', class: 'Inter Part-I', section: 'A', contact: '+92 300 1234587', status: 'active', enrollmentDate: '2024-02-10' },
    { id: 'STD023', name: 'Aleena', class: 'Inter Part-II', section: 'A', contact: '+92 300 1234567', status: 'active', enrollmentDate: '2024-01-20' },
    { id: 'STD010', name: 'Abdul Basit', class: 'Inter Part-II', section: 'B', contact: '+92 300 1234567', status: 'active', enrollmentDate: '2024-02-05' }
];

// Update stats cards with real-time data
function updateStatsDisplay() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get latest students data
    const currentStudents = JSON.parse(localStorage.getItem('students')) || students;

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
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = stats.totalStudents;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = stats.newEnrollments;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = stats.averageAttendance + '%';
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = stats.averageGPA;
}

// Filter students based on all search criteria with real-time updates
function filterStudents() {
    // Get latest students data
    const currentStudents = JSON.parse(localStorage.getItem('students')) || students;
    
    const nameSearch = nameSearchInput.value.toLowerCase();
    const idSearch = idSearchInput.value.toLowerCase();
    const classValue = classFilter.value;
    const sectionValue = sectionFilter.value;

    const filteredStudents = currentStudents.filter(student => {
        const matchesName = !nameSearch || student.name.toLowerCase().includes(nameSearch);
        const matchesId = !idSearch || student.id.toLowerCase().includes(idSearch);
        const matchesClass = !classValue || student.class === classValue;
        const matchesSection = !sectionValue || student.section === sectionValue;

        return matchesName && matchesId && matchesClass && matchesSection;
    });

    currentPage = 1; // Reset to first page when filtering
    renderStudents(filteredStudents);
    updatePagination(filteredStudents.length);
    updateStatsDisplay(); // Update stats when filter changes
}

// Render students in the table with pagination
function renderStudents(studentsToRender) {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const paginatedStudents = studentsToRender.slice(startIndex, endIndex);

    tableBody.innerHTML = paginatedStudents.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td>${student.contact}</td>
            <td><span class="status-badge ${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span></td>
            <td>
                <div class="action-buttons">
                    <a href="singleStudentView.html?id=${student.id}" class="btn-icon view-btn" title="View Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </a>
                    <button class="btn-icon" title="Delete" onclick="deleteStudent('${student.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Edit student
function editStudent(studentId) {
    // Get latest students data from localStorage
    students = JSON.parse(localStorage.getItem('students')) || students;
    const student = students.find(s => s.id === studentId);
    if (student) {
        localStorage.setItem('currentEditStudent', JSON.stringify(student));
        window.location.href = `singleStudentView.html?id=${studentId}`;
    }
}

// Delete student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        // Get latest students data from localStorage
        students = JSON.parse(localStorage.getItem('students')) || students;
        students = students.filter(student => student.id !== studentId);
        localStorage.setItem('students', JSON.stringify(students));
        updateStatsDisplay();
        filterStudents();
    }
}

// Event listeners for real-time updates
nameSearchInput.addEventListener('input', filterStudents);
idSearchInput.addEventListener('input', filterStudents);
classFilter.addEventListener('change', filterStudents);
sectionFilter.addEventListener('change', filterStudents);
addStudentBtn.addEventListener('click', () => {
    window.location.href = 'addStudent.html';
});

// Listen for storage events to sync data across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'students' || e.key === 'studentStats') {
        filterStudents();
        updateStatsDisplay();
    }
});

// Refresh data periodically
setInterval(() => {
    filterStudents();
    updateStatsDisplay();
}, 30000); // Update every 30 seconds

// Update pagination controls
function updatePagination(totalStudents) {
    const totalPages = Math.ceil(totalStudents / studentsPerPage);
    let paginationHTML = '';

    // Previous button
    paginationHTML += `<button class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="btn-page ${currentPage === i ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    // Next button
    paginationHTML += `<button class="btn-page" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>`;

    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    filterStudents();
}

// Save initial data if not exists
if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(students));
}

// Initial render with latest data
filterStudents();
updateStatsDisplay();
updatePagination(students.length);