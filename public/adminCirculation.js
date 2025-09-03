const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

var statusElements = document.querySelectorAll('.status');

// --------------------SIDEBAR START
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

// --------------------SIDEBAR MENU END

// -------------------- SEARCH START

document.addEventListener('DOMContentLoaded', () => {
    getCirculationInfo("");

    const searchInput = document.getElementById('searchInput');

    // Add event listener for input events
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            getCirculationInfo("");
        } 
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            getCirculationInfo(searchTerm);
        }
    });

});

// ------------------------ CIRCULATION TABLE START

async function getCirculationInfo(searchInput) {
    console.log(searchInput)
    try {
        const response = await fetch('http://localhost:3000/getCirculationB', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchInput }),
        });
 
        const data = await response.json();

        if (data.success) {
            populateFinesInfoTable1(data.fine);
        } else {
            console.error('Error fetching CIRCULATION information:', data.message);
        }
    } catch (error) {
        console.error('Error fetching CIRCULATION information:', error);
    }
    var daysLateSep = document.querySelectorAll('.daysLateSep');

    daysLateSep.forEach(function(element) {
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
        case 'Borrowing':
            element.style.borderColor = '#118F11'; // green
            element.style.color = '#118F11';
            break;
        case 'Overdue':
            element.style.borderColor = '#FF0000'; // red
            element.style.color = '#FF0000';
            break;
        case 'Return':
            element.style.borderColor = '#7D7D7D'; // grey
            element.style.color = '#7D7D7D';
            break;
        }
    });     
}

function populateFinesInfoTable1(finesInfo) {
const resultBody = document.querySelector('.table-wrapper table');
resultBody.innerHTML = ""; // Clear the table content
const headers = `
<thead class="table-head" style="background-color: #00557F;">
    <tr>
        <th>User ID</th>
        <th>Accession Number</th>
        <th>Book Title</th>
        <th>Check Out Date</th>
        <th>Check In Date</th>
        <th>Status</th>
    </tr>
</thead>
<tbody id="hello4" style="background-color: white;">
`;

resultBody.innerHTML = headers;

finesInfo.forEach(fine => {
    const row = document.createElement('tr');
    var returned = null;
    if(fine.returned_date){
        returned =fine.returned_date.split("T")[0]
    }else{
        returned="-"
    }

    row.innerHTML = `
        <td>${fine.userId}</td>
        <td>${fine.accessionNumber}</td>
        <td>${fine.title}</td>
        <td>${fine.check_out_date.split("T")[0]}</td>
        <td>${returned}</td>
        <td><span class="daysLateSep">${fine.daysLate}</span></td>
    `;
    resultBody.querySelector('tbody').appendChild(row);
});
}



// -------------------- UPDATE BOOKS END

// -------------------- CANCEL UPDATE BOOKS START

function cancel() {
    $('#contactForm').fadeOut();
}
// -------------------- CANCEL UPDATE BOOKS END

// -------------------- HIDE//SHOW DIALOG START

function hideDialog() {
    document.getElementById("dialog").style.display = "none";
  }
  
  function showDialog(header,para) {
    var h2Element = document.querySelector('#dialog-content h2');
    var pElement = document.querySelector('#dialog-content p');
    
    // Changing the content
    h2Element.textContent = header;
    pElement.textContent = para;
    document.getElementById("dialog").style.display = 'block';
  }
// -------------------- HIDE//SHOW DIALOG END


    function cancel() {
        $('#contactForm').fadeOut();
    } 










