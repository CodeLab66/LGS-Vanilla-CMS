// Department and venue options
const departments = [
    'All Departments',
    'Science Department',
    'Arts Department',
    'Commerce Department',
    'Computer Science Department',
    'Mathematics Department',
    'Language Department'
];

const venues = [
    'Main Hall',
    'Campus Ground',
    'Auditorium',
    'Science Lab',
    'Computer Lab',
    'Library',
    'Conference Room'
];

// Function to create dropdown options
function createDropdownOptions(container, options) {
    const select = document.createElement('select');
    select.className = 'event-dropdown';
    
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
    
    return select;
}

// Function to convert table cells to editable format
function makeEventsEditable() {
    const eventRows = document.querySelectorAll('.events-table tbody tr');
    
    eventRows.forEach(row => {
        const dateCell = row.cells[1];
        const departmentCell = row.cells[2];
        const venueCell = row.cells[3];
        
        // Create date input
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'event-date';
        const currentDate = dateCell.textContent.trim();
        if (currentDate) {
            const dateParts = currentDate.split(',')[0].split(' ');
            const month = new Date(Date.parse(dateParts[0] + ' 1, 2000')).getMonth() + 1;
            const formattedDate = `2025-${month.toString().padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
            dateInput.value = formattedDate;
        }
        dateCell.textContent = '';
        dateCell.appendChild(dateInput);
        
        // Create department dropdown
        const departmentSelect = createDropdownOptions(departmentCell, departments);
        departmentSelect.value = departmentCell.textContent.trim();
        departmentCell.textContent = '';
        departmentCell.appendChild(departmentSelect);
        
        // Create venue dropdown
        const venueSelect = createDropdownOptions(venueCell, venues);
        venueSelect.value = venueCell.textContent.trim();
        venueCell.textContent = '';
        venueCell.appendChild(venueSelect);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', makeEventsEditable);