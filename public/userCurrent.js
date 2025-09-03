const userId = localStorage.getItem('user_id');
if (userId) {
    console.log(userId)
    fetch('http://localhost:3000/countBorrowedBooks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            
        } else {
            console.error('Error retrieving total fines:', data.message);
        }
    })
    .catch(error => {
        console.error('Error retrieving total fines:', error);
    });
} else {
    console.error('userId not found in sessionStorage');
}

document.addEventListener('DOMContentLoaded', getBorrowedBooks);


async function getBorrowedBooks() {
    try {
        const response = await fetch('http://localhost:3000/getBorrowedBooks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (data.success) {
            populateBorrowedBooksTable(data.borrowedBooks);
        } else {
            console.error('Error fetching borrowed books:', data.message);
        }
    } catch (error) {
        console.error('Error fetching borrowed books:', error);
    }
}

function populateBorrowedBooksTable(borrowedBooks) {
    const tableBody = document.getElementById('hello');

    borrowedBooks.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <button onclick="renewBook(${parseInt(book.borrowId)}, '${book.title}', '${book.authors}', '${book.returnDate.split("T")[0]}','${book.renewalCount}')" class="renew-btn">Renew</button>
            </td>
            <td>${book.borrowId}</td>
        `

        const td = document.createElement('td');

        const bookImage = document.createElement('img');
        bookImage.src = `data:image/png;base64,${book.book_cover_base64}`;
        bookImage.alt = 'book cover';
        bookImage.width = '67';
        bookImage.height = '100';
        bookImage.style = 'box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;'
        bookImage.classList.add('book-image');

        td.appendChild(bookImage);

        row.appendChild(td);

        row.innerHTML+=`
            <td>${book.title}</td>
            <td>${book.authors}</td>
            <td>${book.isbn}</td>
            <td>${book.accessionNumber}</td>
            <td>${book.borrowDate.split("T")[0]}</td>
            <td data-borrow-id="${book.borrowId}" data-column="return-date">${book.returnDate.split("T")[0]}</td>
            <td>${book.renewalCount}</td>
            
        `;
        tableBody.appendChild(row);
    });
} 
function renewBook(borrowId, title, authors, currentReturnDate,renewCount) {
    showDialog("Renew Return Date", formatBookDetails(borrowId, title, authors, currentReturnDate));

    const confirmButton = document.getElementById("confirm")
    confirmButton.addEventListener('click', () => handleConfirm(parseInt(borrowId),parseInt(renewCount)));
}



async function handleConfirm(borrowId, renewalCount) {
    try {
        const response = await fetch('http://localhost:3000/renewBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ borrowId,renewalCount }),
        });

        const data = await response.json();

        if (data.success) {
            console.log(`Renewal successful for book with ID ${borrowId}`);
            showDialog("Success!", "Renewed Successfully");
            // hideDialog();
            // location.reload();
        } else {
            document.getElementById("result").textContent = data.message;
            console.error('Renewal failed:', data.message);
        }
    } catch (error) {
        console.error('Error during renewal:', error);
    } 
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

// function formatBookDetails(borrowId, title, authors, currentReturnDate) {
//     return `Borrow ID: ${borrowId}<br>Title: ${title}<br>Authors: ${authors}<br>Current Return Date: ${currentReturnDate}`;
// }
function formatBookDetails(borrowId, title, authors, currentReturnDate) {
    const titleStyle = 'color: #00557F;';
    const paraStyle = 'color: black;';

    return `
        <span style="${titleStyle}">Borrow ID:</span> <span style="${paraStyle}">${borrowId}</span><br>
        <span style="${titleStyle}">Title:</span> <span style="${paraStyle}">${title}</span><br>
        <span style="${titleStyle}">Authors:</span> <span style="${paraStyle}">${authors}</span><br>
        <span style="${titleStyle}">Current Return Date:</span> <span style="${paraStyle}">${currentReturnDate}</span>`;
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
