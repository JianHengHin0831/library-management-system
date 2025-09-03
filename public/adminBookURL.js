const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

var statusElements = document.querySelectorAll('.status');

// -------------------- SEARCH START
document.addEventListener('DOMContentLoaded', () => {
    searchBooks("");

    const searchInput = document.getElementById('hello5');
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value;
            searchBooks(searchTerm);
        }
    });
});

async function searchBooks(searchInput) {
    try {
        const response = await fetch('http://localhost:3000/searchBooks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchInput }),
        });

        const data = await response.json();

        if (data.success) {
            populateResultTable(data.books);
        } else {
            console.error('Error fetching books:', data.message);
        }
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function populateResultTable(books) {
    const resultBody = document.querySelector('.table-wrapper table');
    resultBody.innerHTML = ""; // Clear the table content
    
    const headers = `
    <thead class="table-head" style="background-color: #00557F;">
        <tr>
            <th></th>
            <th>Accession Number</th>
            <th>ISBN</th>
            <th>Book</th>
            <th>Title</th>
            <th>Edition</th>
            <th>Author</th>
            <th>Condition</th>
            <th>Status</th>
            <th>Price</th>
            <th>Location</th>
            <th>Subject Area</th>
            <th>Keywords</th>
            <th>Imprint</th>
            <th>Call Number</th>
            <th>Book Type</th>
        </tr>
    </thead>
    <tbody id="hello4" style="background-color: white;">
    `;

    resultBody.innerHTML = headers;

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="delete-edit-block">
                    <span class="trash-icon"><i class='bx bx-trash icon'></i></span>
                    <button class="first-block-button" onclick="editBookDialog(
                        '${book.accession_number}', 
                        '${book.ISBN}', 
                        '${book.title}', 
                        '${book.edition}', 
                        '${book.authors}', 
                        '${book.copies_condition}', 
                        '${book.price}', 
                        '${book.location}', 
                        '${book.subject_area}', 
                        '${book.keywords}', 
                        '${book.imprint}', 
                        '${book.type_of_book}'
                    )"><i class='bx bx-pencil'></i>Edit</button>
                </div>
            </td>
            <td>${book.accession_number}</td>
            <td>${book.ISBN}</td>
            <td><img src="${book.book_cover}", style="width: 90px; height: 120px;"></td>
            <td>${book.title}</td>
            <td>${book.edition}</td>
            <td>${book.authors}</td>
            <td>${book.copies_condition}</td>
            <td>${book.status}</td>
            <td>${book.price}</td>
            <td>${book.location}</td>
            <td>${book.subject_area}</td>
            <td>${book.keywords}</td>
            <td>${book.imprint}</td>
            <td>${book.call_number}</td>
            <td>${book.type_of_book}</td>
        `;
        resultBody.querySelector('tbody').appendChild(row);
    });
}

// <td><img src="data:image/png;base64,${book.book_cover_base64}" alt="book cover" width="100" height="100"></td>


// -------------------- SEARCH END

// -------------------- EDIT BOOKS START

function editBookDialog(accession_number,ISBN,title,edition,authors,status1,price,location,subject_area,keywords,imprint,type_of_book) {
    document.getElementById("accession_number1").value =accession_number;
    document.getElementById("isbn1").value = ISBN;
    document.getElementById("title1").value = title;
    document.getElementById("edition1").value = edition;
    document.getElementById("author1").value = authors;
    document.getElementById("copies_condition1").value = status1;
    document.getElementById("price1").value = price;
    document.getElementById("location1").value = location;
    document.getElementById("subject_area1").value = subject_area;
    document.getElementById("keywords1").value = keywords;
    document.getElementById("imprint1").value = imprint;
    document.getElementById("book_type1").value = type_of_book;
    
    
    $('#contactForm').fadeToggle();
}
// -------------------- EDIT BOOKS END

// -------------------- UPDATE BOOKS START

async function updateBook() {
    const accession_number = document.getElementById("accession_number1").value;
    const ISBN = document.getElementById("isbn1").value;
    const title = document.getElementById("title1").value;
    const edition = document.getElementById("edition1").value;
    const authors = document.getElementById("author1").value;
    const copies_condition = document.getElementById("copies_condition1").value;
    const price = document.getElementById("price1").value;
    const location = document.getElementById("location1").value;
    const subject_area = document.getElementById("subject_area1").value;
    const keywords = document.getElementById("keywords1").value;
    const imprint = document.getElementById("imprint1").value;
    const type_of_book = document.getElementById("book_type1").value;

    try {
        const response = await fetch(`http://localhost:3000/updateBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accession_number,
                ISBN,
                title,
                edition,
                authors,
                copies_condition,
                price,
                location,
                subject_area,
                keywords,
                imprint,
                type_of_book
            }),
        });

        const result = await response.json();

        if (result.success) {
            // alert('Book updated successfully!');
            showDialog("Nice","Book updated successfully!");
            $('#contactForm').fadeOut();
        } else {
            // alert(`Error updating book: ${result.message}`);
            showDialog("Error",result.message)
        }
    } catch (error) {
        console.error('Error updating book:', error);
        // alert('Error updating book. Please try again.');
        showDialog("Error","Please try again");
    }
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

// --------------------SIDEBAR MENU START
function menu1(a){
    switch(a) {
        case 1:
        window.location.href = 'adminHome.html'
        break;
        case 2:
        window.location.href = 'adminDashboard.html'
        break;
        case 3:
        window.location.href = 'adminCatalog.html'
        break;
        case 4:
        window.location.href = 'adminBorrow.html'
        break;
        case 5:
        window.location.href = 'adminBook.html'
        break;
        case 6:
        window.location.href = 'adminPatrons.html'
        break;
        case 7:
        window.location.href = 'adminCirculation.html'
        break;
        case 8:
        window.location.href = 'adminOverdue.html'
        break;
        case 9:
        window.location.href = 'adminFines.html'
        break;
        case 10:
        window.location.href = 'adminReservation.html'
        break;
        case 11:
        window.location.href = 'adminReport.html'
        break;
        case 12:
        window.location.href = 'signIn.html'
        break;
        default:
        break;
    }
}

function expand() {
    const sidebar = body.querySelector('.sidebar');
    const contentSection = document.getElementById("main-contents");
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

// -------------------- STATUS START
statusElements.forEach(function(element) {
    element.style.border = '2px solid';
     element.style.borderRadius = '10px';
     element.style.padding = '5px';
     element.style.fontWeight = 'bold';
 
     switch (element.textContent) {
         case 'Overdue':
             element.style.borderColor = 'orange';
             element.style.color = 'orange';
             break;
         default:
             element.style.borderColor = 'red';
             element.style.color = 'red';    }
 });
 
 const userId = localStorage.getItem('user_id');
 console.log(userId);
 document.addEventListener('DOMContentLoaded', getFinesInfo);
 async function getFinesInfo() {
     try {
         const response = await fetch('http://localhost:3000/getFines', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({ userId }),
         }); 
 
         const data = await response.json();
 
         if (data.success) {
             populateFinesInfoTable(data.fine);
         } else {
             console.error('Error fetching fines information:', data.message);
         }
     } catch (error) {
         console.error('Error fetching fines information:', error);
     }
 
     var statusElements = document.querySelectorAll('.status');
 
     statusElements.forEach(function(element) {
         element.style.border = '2px solid';
          element.style.borderRadius = '10px';
          element.style.padding = '5px';
          element.style.fontWeight = 'bold';
      
          switch (element.textContent) {
              case 'Overdue':
                  element.style.borderColor = 'orange';
                  element.style.color = 'orange';
                  break;
              default:
                  element.style.borderColor = 'red';
                  element.style.color = 'red';    }
      });
 }
 
 function populateFinesInfoTable(finesInfo) {
     const tableBody = document.getElementById('hello2');
 
     finesInfo.forEach(fine => {
         const row = document.createElement('tr');
         row.innerHTML = `
             <td>${fine.finesId}</td>
             <td>${fine.borrowId}</td>
             <td>${fine.title}</td>
             <td>${fine.authors}</td>
             <td>${fine.isbn}</td>
             <td>${fine.accessionNumber}</td>
             <td>${fine.price}</td>
             <td>${fine.finesPrice}</td>
             <td>${fine.daysLate}</td>
             <td class="status">${fine.status}</td>
         `;
         tableBody.appendChild(row);
     });
 
 }
 
 
 async function fetchAccountData(method) {
     const contactForm = document.querySelector('#contactForm');
     contactForm.innerHTML = ''; 
     try {
         const response = await fetch('http://localhost:3000/account', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify(),
         });  
  
         const data = await response.json();
 
         if (data.success) {
             if (method === 'bank') {
                 const bankElement = document.createElement('p');
                 bankElement.textContent = `Bank: ${data.data.bank}`;
                 contactForm.appendChild(bankElement);
         
                 const accountElement = document.createElement('p');
                 accountElement.textContent = `Account: ${data.data.account}`;
                 contactForm.appendChild(accountElement);
             } else {
                 const imgElement = document.createElement('img');
                 imgElement.src = `data:image/png;base64,${data.data.imgBase64}`;
                 imgElement.width = 50;
                 imgElement.height = 50;
                 contactForm.appendChild(imgElement);
             }
             $(contactForm).fadeToggle();
             
         } else {
             console.error('Error fetching fines information:', data.message);
         }
     } catch (error) {
         console.error('Error fetching fines information:', error);
     }
 }
 
 
 
   async function payFines() {
     try {
         const finesAmount = 1;
         const response = await fetch('http://localhost:3000/payFines', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({ finesAmount }),
         }); 
  
         const data = await response.json();
 
         if (response.ok) {
             if (data.success) {
                 window.location.href = data.redirectUrl;
             } else {
                 console.error('Payment initiation failed:', data.message);
             }
         } else {
             console.error('HTTP error:', response.statusText);
         }
     } catch (error) {
         console.error('Error:', error);
     }
 }
 
 
 async function fetchPaymentMethods() {
     try {
         const response = await fetch('http://localhost:3000/paymentMethods', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 "merchantAccount": 'HelloCompany473ECOM',
                 "countryCode": "MY",
                 "amount": {
                     "currency": "MYR",
                     "value": 1
                 }
             }),
         });
 
         const data = await response.json();
 
         if (response.ok) {
             console.log('Available payment methods:', data);
         } else {
             console.error('Error fetching payment methods:', data.error);
         }
     } catch (error) {
         console.error('Error fetching payment methods:', error);
     }
 }
 
 
 fetchPaymentMethods();
 
 
 function cancel() {
     $('#contactForm').fadeOut();
 } 










