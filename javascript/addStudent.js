document.addEventListener('DOMContentLoaded', function() {
    const addStudentForm = document.getElementById('addStudentForm');

    addStudentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values with enrollment date
        const newStudent = {
            id: document.getElementById('studentId').value,
            name: document.getElementById('studentName').value,
            class: document.getElementById('class').value,
            section: document.getElementById('section').value,
            contact: document.getElementById('contact').value,
            email: document.getElementById('email').value,
            status: 'active',
            enrollmentDate: new Date().toISOString(),
            attendance: 95, // Default attendance
            gpa: 3.5 // Default GPA
        };

        // Validate form
        if (!validateForm(newStudent)) {
            return;
        }

        // Here you would typically send the data to your backend
        // For now, we'll store it in localStorage
        saveStudent(newStudent);

        // Show success message
        alert('Student added successfully!');

        // Redirect back to students page
        window.location.href = 'students.html';
    });

    function validateForm(student) {
        // Basic validation
        if (!student.id || !student.name || !student.class || !student.section || !student.contact) {
            alert('Please fill in all required fields');
            return false;
        }

        // Validate student ID format (e.g., STD001)
        if (!/^STD\d{3}$/.test(student.id)) {
            alert('Student ID must be in format STD001');
            return false;
        }

        // Validate contact number (Pakistan format)
        if (!/^\+92\s?3\d{2}\s?\d{7}$/.test(student.contact)) {
            alert('Please enter a valid Pakistan mobile number (+92 3XX XXXXXXX)');
            return false;
        }

        // Validate email if provided
        if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        return true;
    }

    function saveStudent(student) {
        // Get existing students from localStorage or initialize empty array
        let students = JSON.parse(localStorage.getItem('students') || '[]');

        // Check if student ID already exists
        if (students.some(s => s.id === student.id)) {
            alert('Student ID already exists!');
            return;
        }

        // Add new student
        students.push(student);

        // Save back to localStorage
        localStorage.setItem('students', JSON.stringify(students));

        // Update stats
        updateStats(students);
    }

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
});