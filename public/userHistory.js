const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

document.addEventListener('DOMContentLoaded', () => {
    getBorrowedBooks("");

    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            getBorrowedBooks("");
        } 
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            getBorrowedBooks(searchTerm);
        }
    });

}); 

const userId = localStorage.getItem('user_id');
async function getBorrowedBooks(searchInput) {
    try {
        const response = await fetch('http://localhost:3000/getBorrowedHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId,searchInput }),
        });

        const data = await response.json();
        if (data.success) {
            console.log(data.borrowedBooks)
            populateBorrowedBooksTable(data.borrowedBooks);
        } else {
            console.error('Error fetching borrowed books:', data.message);
        }
    } catch (error) {
        console.error('Error fetching borrowed books:', error);
    }
}


function populateBorrowedBooksTable(borrowedBooks) {
    const tableBody = document.getElementById('hello1');
    tableBody.innerHTML='';

    borrowedBooks.forEach(book => {
        const row = document.createElement('tr');
        console.log(book.borrowId);

        row.innerHTML = `
            <td class='status'><span class="statusSep">${book.status}</span></td>
            <td>${book.borrowId}</td>
            <td>${book.title}</td>
            <td>${book.authors}</td>
            <td>${book.isbn}</td>
            <td>${book.accessionNumber}</td>
            <td>${book.borrowDate.split("T")[0]}</td>
            <td>${book.returnDate.split("T")[0]}</td>
        `;
        tableBody.appendChild(row);
    }); 

    var statusSep = document.querySelectorAll('.statusSep');

    statusSep.forEach(function(element) {
        element.style.border = '2px solid';
        element.style.borderRadius = '20px';
        element.style.padding = '5px';
        element.style.margin = '10px';
        element.style.display = 'inline-block'; 
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.textAlign = 'center';
        element.style.width = '110px';
        element.style.height = '30px';
        element.style.lineHeight = '20px';

        switch (element.textContent) {
            case 'Borrowing':
                element.style.borderColor = 'green';
                element.style.color = 'green';
                break;
            case 'Returned':
                element.style.borderColor = 'grey';
                element.style.color = 'grey';
                break;
            default:
                element.style.borderColor = 'red';
                element.style.color = 'red';
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {
    var statusElements = document.querySelectorAll('.status');

    statusElements.forEach(function(element) {
        element.style.border = '2px solid';
        element.style.borderRadius = '10px';
        element.style.padding = '5px';
        element.style.fontWeight = 'bold';

        switch (element.textContent) {
            case 'Borrowing':
                element.style.borderColor = 'green';
                element.style.color = 'green';
                break;
            case 'Return':
                element.style.borderColor = 'grey';
                element.style.color = 'grey';
                break;
            default:
                element.style.borderColor = 'red';
                element.style.color = 'red';
        }
    });
});

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