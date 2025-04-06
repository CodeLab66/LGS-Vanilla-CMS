// Sample teacher data structure
let teachers = JSON.parse(localStorage.getItem('teachers')) || [
    {
        id: '001',
        name: 'John Doe',
        subject: 'Mathematics',
        classes: 5,
        students: 120,
        rating: 4.5,
        status: 'Active',
        email: 'john.doe@school.com',
        phone: '+1234567890',
        joinDate: '2022-09-01',
        department: 'Science',
        qualification: 'M.Sc. Mathematics'
    },
    {
        id: '002',
        name: 'Jane Smith',
        subject: 'English',
        classes: 4,
        students: 95,
        rating: 4.8,
        status: 'Active',
        email: 'jane.smith@school.com',
        phone: '+1234567891',
        joinDate: '2022-08-15',
        department: 'Languages',
        qualification: 'M.A. English Literature'
    }
];

// DOM Elements
const teacherTable = document.querySelector('.teacher-table tbody');
const searchInput = document.querySelector('.filter-input');
const statsElements = {
    totalTeachers: document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-value'),
    newlyHired: document.querySelector('.stats-grid .stat-card:nth-child(2) .stat-value'),
    averageRating: document.querySelector('.stats-grid .stat-card:nth-child(3) .stat-value'),
    absentPerMonth: document.querySelector('.stats-grid .stat-card:nth-child(4) .stat-value')
};

// Initialize modal
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>Teacher Details</h2>
            <button class="close-btn">&times;</button>
        </div>
        <div class="teacher-details"></div>
    </div>
`;
document.body.appendChild(modal);

// Update Stats
function updateStats() {
    const activeTeachers = teachers.filter(t => t.status === 'Active');
    const newTeachers = teachers.filter(t => {
        const joinDate = new Date(t.joinDate);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return joinDate > oneMonthAgo;
    });
    const avgRating = teachers.reduce((acc, curr) => acc + curr.rating, 0) / teachers.length;

    statsElements.totalTeachers.textContent = activeTeachers.length;
    statsElements.newlyHired.textContent = newTeachers.length;
    statsElements.averageRating.textContent = avgRating.toFixed(1);
    statsElements.absentPerMonth.textContent = '3'; // This would be dynamic in a real application
}

// Render Teachers Table
function renderTeachers(teachersList = teachers) {
    teacherTable.innerHTML = teachersList.map(teacher => `
        <tr>
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.classes}</td>
            <td>${teacher.students}</td>
            <td>${teacher.rating}</td>
            <td>${teacher.status}</td>
            <td>
                <button class="view-btn" data-id="${teacher.id}">View</button>
                <button class="delete-btn" data-id="${teacher.id}">Delete</button>
            </td>
        </tr>
    `).join('');

    // Add event listeners to buttons
    teacherTable.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => viewTeacher(btn.dataset.id));
    });

    teacherTable.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteTeacher(btn.dataset.id));
    });
}

// Search/Filter Teachers
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTeachers = teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(searchTerm) ||
        teacher.subject.toLowerCase().includes(searchTerm)
    );
    renderTeachers(filteredTeachers);
});

// View Teacher Details
function viewTeacher(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const teacherDetails = document.querySelector('.teacher-details');
    teacherDetails.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Name</div>
            <div class="detail-value">${teacher.name}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Subject</div>
            <div class="detail-value">${teacher.subject}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Email</div>
            <div class="detail-value">${teacher.email}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Phone</div>
            <div class="detail-value">${teacher.phone}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Department</div>
            <div class="detail-value">${teacher.department}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Qualification</div>
            <div class="detail-value">${teacher.qualification}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Join Date</div>
            <div class="detail-value">${teacher.joinDate}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Rating</div>
            <div class="detail-value">${teacher.rating}</div>
        </div>
    `;

    modal.style.display = 'flex';
}

// Delete Teacher
function deleteTeacher(teacherId) {
    if (confirm('Are you sure you want to delete this teacher?')) {
        teachers = teachers.filter(t => t.id !== teacherId);
        localStorage.setItem('teachers', JSON.stringify(teachers));
        renderTeachers();
        updateStats();
    }
}

// Close Modal
modal.querySelector('.close-btn').addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initial render
updateStats();
renderTeachers();