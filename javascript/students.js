// DOM Elements
const nameSearchInput = document.getElementById('nameSearch');
const idSearchInput = document.getElementById('idSearch');
const classFilter = document.getElementById('classFilter');
const sectionFilter = document.getElementById('sectionFilter');
const addStudentBtn = document.getElementById('addStudentBtn');
const tableBody = document.querySelector('.data-table tbody');

// Sample student data (will be replaced with actual data from backend)
let students = [
    { id: 'STD001', name: 'Muhammad Bilal', class: 'Inter Part-II', section: 'A', contact: '+92 300 1234567', status: 'active' },
    { id: 'STD001', name: 'Muhammad Ali', class: 'Inter Part-I', section: 'B', contact: '+92 300 1234767', status: 'active' },
    { id: 'STD001', name: 'Ayesha', class: 'Inter Part-I', section: 'A', contact: '+92 300 1234587', status: 'active' },
    { id: 'STD001', name: 'Aleena', class: 'Inter Part-II', section: 'A', contact: '+92 300 1234567', status: 'active' },
    { id: 'STD001', name: 'Abdul Basit', class: 'Inter Part-II', section: 'B', contact: '+92 300 1234567', status: 'active' }
];

// Filter students based on all search criteria
function filterStudents() {
    const nameSearch = nameSearchInput.value.toLowerCase();
    const idSearch = idSearchInput.value.toLowerCase();
    const classValue = classFilter.value;
    const sectionValue = sectionFilter.value;

    const filteredStudents = students.filter(student => {
        const matchesName = !nameSearch || student.name.toLowerCase().includes(nameSearch);
        const matchesId = !idSearch || student.id.toLowerCase().includes(idSearch);
        const matchesClass = !classValue || student.class === classValue;
        const matchesSection = !sectionValue || student.section === sectionValue;

        return matchesName && matchesId && matchesClass && matchesSection;
    });

    renderStudents(filteredStudents);
}

// Render students in the table
function renderStudents(studentsToRender) {
    tableBody.innerHTML = studentsToRender.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td>${student.contact}</td>
            <td><span class="status-badge ${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="Edit" onclick="editStudent('${student.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
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
    const student = students.find(s => s.id === studentId);
    if (student) {
        // TODO: Implement edit functionality
        console.log('Editing student:', student);
    }
}

// Delete student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== studentId);
        renderStudents(students);
    }
}

// Event listeners
nameSearchInput.addEventListener('input', filterStudents);
idSearchInput.addEventListener('input', filterStudents);
classFilter.addEventListener('change', filterStudents);
sectionFilter.addEventListener('change', filterStudents);
addStudentBtn.addEventListener('click', () => {
    // TODO: Implement add student functionality
    
    console.log('Add new student clicked');
});

// Initial render
renderStudents(students);