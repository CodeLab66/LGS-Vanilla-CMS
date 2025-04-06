document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const editableFields = document.querySelectorAll('.editable-field');
    const enrollmentDateSpan = document.getElementById('enrollmentDate');
    const attendanceSpan = document.getElementById('attendance');
    const gpaSpan = document.getElementById('gpa');

    // Get student ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');

    // Load student data
    function loadStudentData() {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const student = students.find(s => s.id === studentId);

        if (student) {
            document.getElementById('studentName').textContent = student.name;
            document.getElementById('studentId').textContent = student.id;
            document.getElementById('section').textContent = student.section;
            document.getElementById('contact').textContent = student.contact;
            document.getElementById('class').textContent = student.class;
            enrollmentDateSpan.textContent = new Date(student.enrollmentDate).toLocaleDateString();
            attendanceSpan.textContent = `${student.attendance || 95}%`;
            gpaSpan.textContent = student.gpa || 3.5;
        }
    }

    // Toggle edit mode
    editButton.addEventListener('click', function() {
        editableFields.forEach(field => {
            field.contentEditable = true;
            field.classList.add('editing');
        });
        editButton.style.display = 'none';
        saveButton.style.display = 'inline-flex';
    });

    // Save changes
    saveButton.addEventListener('click', function() {
        editableFields.forEach(field => {
            field.contentEditable = false;
            field.classList.remove('editing');
        });
        saveButton.style.display = 'none';
        editButton.style.display = 'inline-flex';

        // Get all students and update the specific student
        let students = JSON.parse(localStorage.getItem('students') || '[]');
        const studentIndex = students.findIndex(s => s.id === studentId);

        if (studentIndex !== -1) {
            students[studentIndex] = {
                ...students[studentIndex],
                name: document.getElementById('studentName').textContent,
                section: document.getElementById('section').textContent,
                contact: document.getElementById('contact').textContent,
                class: document.getElementById('class').textContent
            };

            // Save updated students array
            localStorage.setItem('students', JSON.stringify(students));
            
            // Update stats
            updateStats(students);
            
            // Show success message
            alert('Changes saved successfully!');
        }
    });

    function updateStats(students) {
        const stats = {
            totalStudents: students.length,
            newEnrollments: students.filter(s => {
                const enrollmentDate = new Date(s.enrollmentDate);
                const currentDate = new Date();
                return enrollmentDate.getMonth() === currentDate.getMonth() && 
                       enrollmentDate.getFullYear() === currentDate.getFullYear();
            }).length,
            averageAttendance: students.reduce((sum, student) => sum + (student.attendance || 95), 0) / students.length,
            averageGPA: students.reduce((sum, student) => sum + (student.gpa || 3.5), 0) / students.length
        };

        localStorage.setItem('studentStats', JSON.stringify(stats));
    }

    // Load initial data
    loadStudentData();
});