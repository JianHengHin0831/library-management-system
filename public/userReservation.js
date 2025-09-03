const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');


// var statusElements = document.querySelectorAll('.availability');


// statusElements.forEach(function(element) {
//     element.style.border = '2px solid';
//     element.style.borderRadius = '20px';
//     element.style.padding = '5px';
//     element.style.margin = '10px';
//     element.style.display = 'inline-block'; 
//     element.style.alignItems = 'center';
//     element.style.justifyContent = 'center';
//     element.style.textAlign = 'center';
//     element.style.width = '110px';
//     element.style.height = '30px';
//     element.style.lineHeight = '20px';

//     switch (element.textContent) {
//         case 'Available':
//             element.style.borderColor = 'green';
//             element.style.color = 'green';
//             break;
//         case 'Unavailable':
//             element.style.borderColor = 'red';
//             element.style.color = 'red';
//             break;
//     }
// });

// var statusElements = document.querySelectorAll('.status');


// statusElements.forEach(function(element) {
//     element.style.border = '2px solid';
//     element.style.borderRadius = '20px';
//     element.style.padding = '5px';
//     element.style.margin = '10px';
//     element.style.display = 'inline-block'; 
//     element.style.alignItems = 'center';
//     element.style.justifyContent = 'center';
//     element.style.textAlign = 'center';
//     element.style.width = '110px';
//     element.style.height = '30px';
//     element.style.lineHeight = '20px';

//     switch (element.textContent) {
//         case 'Confirmed':
//             element.style.borderColor = 'green';
//             element.style.color = 'green';
//             break;
//         case 'Pending':
//             element.style.borderColor = 'orange';
//             element.style.color = 'orange';
//             break;
//     }
// });

const userId = localStorage.getItem('user_id');

document.addEventListener('DOMContentLoaded', () => {
    getFinesInfo("");

    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            getFinesInfo("");
        } 
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            getFinesInfo(searchTerm);
        }
    });

}); 

async function getFinesInfo(searchInput) {
    try {
        const response = await fetch('http://localhost:3000/getReservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId,searchInput }),
        });

        const data = await response.json();

        if (data.success) {
            populateFinesInfoTable(data.reservations);
        } else {
            console.error('Error fetching fines information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching fines information:', error);
    }


var statusElements = document.querySelectorAll('.availability');

statusElements.forEach(function(element) {
    element.style.border = '2px solid';
    element.style.borderRadius = '20px';
    element.style.padding = '5px';
    element.style.display = 'inline-block'; 
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.textAlign = 'center';
    element.style.width = '110px';
    element.style.height = '30px';
    element.style.lineHeight = '20px';

    switch (element.textContent) {
        case 'Available':
            element.style.borderColor = 'green';
            element.style.color = 'green';
            break;
        case 'Unavailable':
            element.style.borderColor = 'red';
            element.style.color = 'red';
            break;
    }
});

var statusElements = document.querySelectorAll('.status');

statusElements.forEach(function(element) {
    element.style.border = '2px solid';
    element.style.borderRadius = '20px';
    element.style.padding = '5px';
    element.style.display = 'inline-block'; 
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.textAlign = 'center';
    element.style.width = '110px';
    element.style.height = '30px';
    element.style.lineHeight = '20px';

    switch (element.textContent) {
        case 'Confirmed':
            element.style.borderColor = 'green';
            element.style.color = 'green';
            break;
        case 'Pending':
            element.style.borderColor = 'orange';
            element.style.color = 'orange';
            break;
    }
});


    
}


function populateFinesInfoTable(finesInfo) {
    const tableBody = document.getElementById('hello3');
    tableBody.innerHTML='';

    finesInfo.forEach(fine => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button onclick="cancelReservation( '${fine.reserve_id}','${fine.title}','${fine.authors}','${fine.availability}','${fine.status}')" class="cancel-btn">Cancel</button>
            </td>
            <td>${fine.title}</td>
            <td>${fine.authors}</td>
            <td>${fine.isbn}</td>
            <td>${fine.accessionNumber}</td>
            <td>${fine.subjectArea}</td>
            <td>${fine.location}</td>
            <td><span class="availability">${fine.availability}</span></td>
            <td><span class="status">${fine.status}</span></td>
            
        `;
        tableBody.appendChild(row);
    });
  
}

async function handleConfirm(reserveId) {
    try {
        const response = await fetch('http://localhost:3000/cancelReservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reserveId}),
        });

        const data = await response.json();

        if (data.success) {
            console.log(`Renewal successful for book with ID ${reserveId}`);
            hideDialog();
            location.reload();
        } else {
            document.getElementById("result").textContent = data.message;
            console.error('Renewal failed:', data.message);
        }
    } catch (error) {
        console.error('Error during renewal:', error);
    } 
}

function cancelReservation(reserveId, title, authors, availability,status1) {
    showDialog("Cancel Reservation", formatBookDetails(title, authors, availability,status1));

    const confirmButton = document.getElementById("confirm")
    confirmButton.addEventListener('click', () => handleConfirm(parseInt(reserveId)));
}

function formatBookDetails(title, authors, availability,status1) {
    const titleStyle = 'color: #00557F;';
    const paraStyle = 'color: black;';

    return `
        <span style="${titleStyle}">Title:</span> <span style="${paraStyle}">${title}</span><br>
        <span style="${titleStyle}">Authors:</span> <span style="${paraStyle}">${authors}</span><br>
        <span style="${titleStyle}">Availability:</span> <span style="${paraStyle}">${availability}</span></br>
        <span style="${titleStyle}">Status:</span> <span style="${paraStyle}">${status1}</span><br>`;
        
}

function hideDialog() {
    document.getElementById("dialog").style.display = "none";
}
  
function showDialog(header, para) {
    var h2Element = document.querySelector('#dialog-content h2');
    var pElement = document.querySelector('#dialog-content p');

    h2Element.textContent = header;
    pElement.innerHTML = para;
    document.getElementById("dialog").style.display = 'block';
    document.getElementById("result").textContent = "";
}



function expand() {
    const sidebar = document.querySelector('.sidebar');
    const contentSection = document.querySelector('main');
    contentSection.classList.toggle('expand');
    const menuText = document.querySelectorAll('.text');
    menuText.forEach(function(text, index){
    setTimeout(() => {
        text.classList.toggle('open2');
    }, index * 50);
})
    sidebar.classList.toggle("close");
}; 
