document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('updateVeteranForm');
    const veteranId = new URLSearchParams(window.location.search).get('id');

    // Populate dropdowns
    populateDropdowns();

    // If editing, load veteran data
    if (veteranId) {
        loadVeteranData(veteranId);
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            veteranId: veteranId,
            firstName: document.getElementById('firstName').value,
            middleName: document.getElementById('middleName').value,
            lastName: document.getElementById('lastName').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            dateOfDeath: document.getElementById('dateOfDeath').value,
            rankId: document.getElementById('rank').value,
            branchId: document.getElementById('branch').value,
            serviceStartDate: document.getElementById('serviceStartDate').value,
            serviceEndDate: document.getElementById('serviceEndDate').value,
            conflictId: document.getElementById('conflict').value
        };

        try {
            const response = await fetch('/api/veterans/' + (veteranId ? veteranId : ''), {
                method: veteranId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            alert(veteranId ? 'Veteran updated successfully!' : 'Veteran added successfully!');
            window.location.href = 'view_veterans.html';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    async function loadVeteranData(id) {
        try {
            const response = await fetch(`/api/veterans/${id}`);
            const veteran = await response.json();
            
            document.getElementById('firstName').value = veteran.firstName;
            document.getElementById('middleName').value = veteran.middleName || '';
            document.getElementById('lastName').value = veteran.lastName;
            document.getElementById('dateOfBirth').value = veteran.dateOfBirth;
            document.getElementById('dateOfDeath').value = veteran.dateOfDeath || '';
            document.getElementById('rank').value = veteran.rankId;
            document.getElementById('branch').value = veteran.branchId;
            document.getElementById('serviceStartDate').value = veteran.serviceStartDate;
            document.getElementById('serviceEndDate').value = veteran.serviceEndDate || '';
            document.getElementById('conflict').value = veteran.conflictId;
        } catch (error) {
            console.error('Error loading veteran data:', error);
            alert('Error loading veteran data. Please try again.');
        }
    }

    function populateDropdowns() {
        const ranks = [
            { id: 'pvt', name: 'Private' },
            { id: 'pfc', name: 'Private First Class' },
            { id: 'cpl', name: 'Corporal' },
            { id: 'sgt', name: 'Sergeant' },
            { id: 'ssg', name: 'Staff Sergeant' },
            { id: 'sfc', name: 'Sergeant First Class' },
            { id: 'msg', name: 'Master Sergeant' },
            { id: '1sg', name: 'First Sergeant' },
            { id: 'sgm', name: 'Sergeant Major' },
            { id: 'csm', name: 'Command Sergeant Major' },
            { id: '2lt', name: 'Second Lieutenant' },
            { id: '1lt', name: 'First Lieutenant' },
            { id: 'cpt', name: 'Captain' },
            { id: 'maj', name: 'Major' },
            { id: 'ltc', name: 'Lieutenant Colonel' },
            { id: 'col', name: 'Colonel' },
            { id: 'bg', name: 'Brigadier General' },
            { id: 'mg', name: 'Major General' },
            { id: 'lg', name: 'Lieutenant General' },
            { id: 'gen', name: 'General' }
        ];

        const branches = [
            { id: 'army', name: 'U.S. Army' },
            { id: 'navy', name: 'U.S. Navy' },
            { id: 'af', name: 'U.S. Air Force' },
            { id: 'mc', name: 'U.S. Marine Corps' },
            { id: 'cg', name: 'U.S. Coast Guard' },
            { id: 'sf', name: 'U.S. Space Force' },
            { id: 'ng', name: 'National Guard' },
            { id: 'res', name: 'Reserves' }
        ];

        const conflicts = [
            { id: 'wwii', name: 'World War II (1939-1945)' },
            { id: 'korea', name: 'Korean War (1950-1953)' },
            { id: 'vietnam', name: 'Vietnam War (1955-1975)' },
            { id: 'gulf', name: 'Gulf War (1990-1991)' },
            { id: 'oef', name: 'Operation Enduring Freedom (2001-2014)' },
            { id: 'oif', name: 'Operation Iraqi Freedom (2003-2011)' },
            { id: 'ond', name: 'Operation New Dawn (2010-2011)' },
            { id: 'oir', name: 'Operation Inherent Resolve (2014-present)' },
            { id: 'peacetime', name: 'Peacetime Service' }
        ];

        populateSelect('rank', ranks);
        populateSelect('branch', branches);
        populateSelect('conflict', conflicts);
    }

    function populateSelect(elementId, options) {
        const select = document.getElementById(elementId);
        select.innerHTML = '<option value="">Select...</option>';
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.id;
            optElement.textContent = option.name;
            select.appendChild(optElement);
        });
    }
});