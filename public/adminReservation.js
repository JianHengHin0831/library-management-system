function expand() {
    const sidebar = document.querySelector('.sidebar');
    const contentSection = document.querySelector("main");
    contentSection.classList.toggle('expand');
    const menuText = document.querySelectorAll('.text');
    menuText.forEach(function(text, index){
    setTimeout(() => {
        text.classList.toggle('open2');
    }, index * 50);
})
    sidebar.classList.toggle("close");
};

document.addEventListener('DOMContentLoaded', () => {
    searchReservation("");

    const searchInput = document.getElementById('searchInput');

    // Add event listener for input events
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            searchReservation("");
        } 
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            searchReservation(searchTerm);
        }
    });

});


async function searchReservation(searchTerm) {
    try {
        const response = await fetch('http://localhost:3000/getReservationB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm }),
        });

        const data = await response.json();

        if (data.success) {
            console.log(data.reservations)
            populateFinesInfoTable(data.reservations);
        } else {
            console.error('Error fetching fines information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching fines information:', error);
    }

//  UPDATED 16/4/2024 11:03PM, 11:25PM START
var statusSep = document.querySelectorAll('.statusSep');

statusSep.forEach(function(element) {
    element.style.border = '2px solid';
    element.style.borderRadius = '20px';
    element.style.padding = '5px';
    element.style.margin = 'auto';
    // element.style.marginTop = '20px';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.textAlign = 'center';
    element.style.width = '110px';
    element.style.height = '30px';
    element.style.lineHeight = '20px';

switch (element.textContent) {
    case 'Confirmed':
        element.style.borderColor = '#118F11'; // green
        element.style.color = '#118F11';
        break;
    case 'Pending':
        element.style.borderColor = '#FF9920'; // orrange
        element.style.color = '#FF9920';
        break;
    case 'Active':
        element.style.borderColor = '#ABABAB'; // grey
        element.style.color = '#ABABAB';
        break;
}
});

// var availibilityElements = document.querySelectorAll('.availability');
var availibilitySeparate = document.querySelectorAll('.availabilitySep');

availibilitySeparate.forEach(function(element) {
element.style.border = '2px solid';
element.style.borderRadius = '20px';
element.style.padding = '5px';
// element.style.margin = '10px';
element.style.margin = 'auto';
element.style.display = 'flex';
element.style.alignItems = 'center';
element.style.justifyContent = 'center';
element.style.textAlign = 'center';
element.style.width = '110px';
element.style.height = '30px';
element.style.lineHeight = '20px';

switch (element.textContent) {
    case 'Available':
        element.style.borderColor = '#118F11'; // green
        element.style.color = '#118F11';
        break;
    case 'Unavailable':
        element.style.borderColor = '#FF4040'; // red
        element.style.color = '#FF4040';
        break;
}
});
}
//  UPDATED 16/4/2024 11:03PM END


function populateFinesInfoTable(finesInfo) {
console.log(finesInfo)
const tableBody = document.getElementById('hello3');
tableBody.innerHTML="";

finesInfo.forEach(fine => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${fine.reserve_id}</td>
        <td>${fine.user_id}</td>
        <td>${fine.title}</td>
        <td>${fine.authors}</td>
        <td>${fine.isbn}</td>
        <td>${fine.accessionNumber}</td>
        <td>${fine.subjectArea}</td>
        <td>${fine.location}</td>
        <td class="availability"><span class="availabilitySep">${fine.availability}</span></td>
        <td class="status"><span class="statusSep">${fine.status}</span></td>
    `;
    tableBody.appendChild(row);
});
}
//  UPDATED 16/4/2024 11:25PM END




    











    










