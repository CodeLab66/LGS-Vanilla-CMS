document.addEventListener('DOMContentLoaded', () => {
    // Initialize action buttons for both activities and events
    initializeActivityActions();
    initializeEventActions();
});

function initializeActivityActions() {
    const activityItems = document.querySelectorAll('.activity-item');

    activityItems.forEach(item => {
        const actionButton = item.querySelector('.activity-action');
        let dropdownMenu = null;

        actionButton.addEventListener('click', (e) => {
            e.stopPropagation();

            // Remove any existing dropdowns
            removeAllDropdowns();

            // Create and show dropdown for this item
            dropdownMenu = createDropdownMenu();
            actionButton.appendChild(dropdownMenu);

            // Position the dropdown
            positionDropdown(dropdownMenu, actionButton);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        removeAllDropdowns();
    });
}

function createDropdownMenu(type = 'activity') {
    const dropdown = document.createElement('div');
    dropdown.className = type === 'activity' ? 'activity-dropdown' : 'event-dropdown';
    
    const removeButton = document.createElement('button');
    removeButton.className = 'dropdown-item delete';
    removeButton.innerHTML = '<i class="fas fa-trash"></i> Delete';
    
    if (type === 'event') {
        const editButton = document.createElement('button');
        editButton.className = 'dropdown-item edit';
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
        
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('tr');
            handleEventEdit(item);
            removeAllDropdowns();
        });
        
        dropdown.appendChild(editButton);
    }

    removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = e.target.closest(type === 'activity' ? '.activity-item' : 'tr');
        
        // Add fade-out animation
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.3s ease';
        
        // Remove the item after animation
        setTimeout(() => {
            item.remove();
        }, 300);
    });

    dropdown.appendChild(removeButton);
    return dropdown;
}

function positionDropdown(dropdown, button) {
    const buttonRect = button.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    dropdown.style.position = 'fixed';
    dropdown.style.zIndex = '1000';
    
    // Position horizontally
    if (buttonRect.right + dropdownRect.width > window.innerWidth) {
        dropdown.style.right = '8px';
    } else {
        dropdown.style.left = `${buttonRect.left}px`;
    }
    
    // Position vertically
    if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
        dropdown.style.bottom = `${viewportHeight - buttonRect.top}px`;
    } else {
        dropdown.style.top = `${buttonRect.bottom + 8}px`;
    }
}

function removeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.activity-dropdown, .event-dropdown');
    dropdowns.forEach(dropdown => dropdown.remove());
}

function handleActivityEdit(activityItem) {
    const detailsElement = activityItem.querySelector('.activity-details');
    const title = detailsElement.querySelector('h3').textContent;
    const description = detailsElement.querySelector('p').textContent;

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = title;
    titleInput.className = 'edit-input';

    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.value = description;
    descriptionInput.className = 'edit-input';

    detailsElement.innerHTML = '';
    detailsElement.appendChild(titleInput);
    detailsElement.appendChild(descriptionInput);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'btn-primary';
    detailsElement.appendChild(saveButton);

    saveButton.addEventListener('click', () => {
        detailsElement.innerHTML = `
            <h3>${titleInput.value}</h3>
            <p>${descriptionInput.value}</p>
        `;
    });
}

function handleEventEdit(eventRow) {
    const cells = eventRow.querySelectorAll('td');
    const titleElement = cells[0].querySelector('.event-title');
    const dateCell = cells[1];
    const departmentCell = cells[2];
    const venueCell = cells[3];

    const originalData = {
        title: titleElement.textContent,
        date: dateCell.textContent,
        department: departmentCell.textContent,
        venue: venueCell.textContent
    };

    // Create input fields
    titleElement.innerHTML = `<input type='text' class='edit-input' value='${originalData.title}'>`;
    dateCell.innerHTML = `<input type='date' class='edit-input' value='${formatDateForInput(originalData.date)}'>`;
    
    // Create department dropdown
    const departments = ['Computer Science', 'Business', 'Engineering', 'Arts', 'Sciences'];
    const departmentSelect = document.createElement('select');
    departmentSelect.className = 'edit-input';
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        if (dept === originalData.department) option.selected = true;
        departmentSelect.appendChild(option);
    });
    departmentCell.innerHTML = '';
    departmentCell.appendChild(departmentSelect);

    // Create venue dropdown
    const venues = ['Main Hall', 'Auditorium', 'Room 101', 'Room 102', 'Conference Room', 'Lab'];
    const venueSelect = document.createElement('select');
    venueSelect.className = 'edit-input';
    venues.forEach(venue => {
        const option = document.createElement('option');
        option.value = venue;
        option.textContent = venue;
        if (venue === originalData.venue) option.selected = true;
        venueSelect.appendChild(option);
    });
    venueCell.innerHTML = '';
    venueCell.appendChild(venueSelect);

    // Add save button
    const actionCell = cells[4];
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'btn-primary';
    actionCell.appendChild(saveButton);

    saveButton.addEventListener('click', () => {
        const inputs = eventRow.querySelectorAll('.edit-input');
        titleElement.textContent = inputs[0].value;
        dateCell.textContent = formatDateForDisplay(inputs[1].value);
        departmentCell.textContent = departmentSelect.value;
        venueCell.textContent = venueSelect.value;
        // Create new action button
        const newActionButton = document.createElement('button');
        newActionButton.className = 'activity-action';
        newActionButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
        
        // Clear action cell and append new button
        actionCell.innerHTML = '';
        actionCell.appendChild(newActionButton);
        
        // Add event listener to the new button
        newActionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeAllDropdowns();
            const dropdownMenu = createDropdownMenu('event');
            newActionButton.appendChild(dropdownMenu);
            positionDropdown(dropdownMenu, newActionButton);
        });
        initializeEventActions(); // Reinitialize event actions
    });
}

function formatDateForInput(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
}

function formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function initializeEventActions() {
    const eventRows = document.querySelectorAll('.events-table tr');

    eventRows.forEach(row => {
        const actionButton = row.querySelector('.activity-action');
        if (actionButton) {
            let dropdownMenu = null;

            actionButton.addEventListener('click', (e) => {
                e.stopPropagation();
                removeAllDropdowns();
                dropdownMenu = createDropdownMenu('event');
                actionButton.appendChild(dropdownMenu);
                positionDropdown(dropdownMenu, actionButton);
            });
        }
    });
}