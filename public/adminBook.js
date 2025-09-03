function showDialog(header,para) {
    var h2Element = document.querySelector('#dialog-content h2');
    var pElement = document.querySelector('#dialog-content p');
    
    // Changing the content
    h2Element.textContent = header;
    pElement.textContent = para;
    document.getElementById("dialog").style.display = 'block';
  }

    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.style.borderRadius ='15px';

    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) { 
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                document.getElementById('placeholderIcon').style.display = 'none';
                document.getElementById('placeholderText').style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
            document.getElementById('placeholderIcon').style.display = 'block';
            document.getElementById('placeholderText').style.display = 'block';
        }
}); 

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

var statusElements = document.querySelectorAll('.status');

// -------------------- SEARCH START
document.addEventListener('DOMContentLoaded', () => {
    searchBooks("");

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            searchBooks(searchTerm);
        }
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            searchBooks("");
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

    var conditionSep = document.querySelectorAll('.conditionSep');

    conditionSep.forEach(function(element) {
    element.style.border = '2px solid';
    element.style.borderRadius = '20px';
    element.style.padding = '5px';
    element.style.margin = '30px';
    element.style.display = 'inline-block'; 
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.textAlign = 'center';
    element.style.width = '110px';
    element.style.height = '30px';
    element.style.lineHeight = '20px';

    switch (element.textContent) {
        case 'Good':
            element.style.borderColor = '#118F11'; // yellow
            element.style.color = '#118F11';
            break;
        case 'Damaged':
            element.style.borderColor = '#FF0000'; // grey
            element.style.color = '#FF0000';
            break;
        }
    });

    var statusSep = document.querySelectorAll('.statusSep');

    statusSep.forEach(function(element) {
    element.style.border = '2px solid';
    element.style.borderRadius = '20px';
    element.style.padding = '5px';
    element.style.margin = '30px';
    element.style.display = 'inline-block'; 
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    element.style.textAlign = 'center';
    element.style.width = '120px';
    element.style.height = '30px';
    element.style.lineHeight = '20px';

    switch (element.textContent) {
        case 'Available':
            element.style.borderColor = '#118F11'; // green
            element.style.color = '#118F11';
            break;
        case 'Checked-out' || 'Checked Out':
            element.style.borderColor = '#FF0000'; // red
            element.style.color = '#FF0000';
            break;
        case 'Checked Out':
            element.style.borderColor = '#FF0000'; // red
            element.style.color = '#FF0000';
            break;
        case 'Reserved':
            element.style.borderColor = '#FFD058'; // grey
            element.style.color = '#FFD058';
            break;
        }
    });     

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
            <th>Price (RM)</th>
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
{/* <span class="trash-icon"><i class='bx bx-trash icon'></i></span> */}
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="delete-edit-block">
                    
                    <button class="first-block-button" onclick="editBookDialog(
                        '${book.ISBN}'
                    )"><i class='bx bx-pencil' style="margin-right: 10px;"></i>Edit</button>
                </div>
            </td>
            <td>${book.accession_number}</td>
            <td>${book.ISBN}</td>
            <td><img src="data:image/png;base64,${book.book_cover_base64}" alt="book cover" width="67" height="100"></td>
            <td>${book.title}</td>
            <td>${book.edition}</td>
            <td>${book.authors}</td>
            <td><span class="conditionSep">${book.copies_condition}</span></td>
            <td><span class="statusSep">${book.status}</span></td>
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

// <td><img src="data:image/png;base64,${book.book_cover_base64}" alt="book cover" width="100" height="130"></td>


// -------------------- SEARCH END

// -------------------- EDIT BOOKS START
function editBookDialog(ISBN) {
   localStorage.setItem('isbn',ISBN);
    window.location.href = "adminBookDetails.html"
}

// -------------------- EDIT BOOKS END

async function fetchImageAsFile(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1); // Extract filename from URL
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

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
    const summary = document.getElementById("summary1").value;
    const imageInput = document.getElementById('image');
    var imageFile = imageInput.files[0];
    if(imageFile===undefined){
        const image = document.getElementById('image').src;
        imageFile = await fetchImageAsFile(image); 
    }
    
 
    const formData = new FormData();
    formData.append('accession_number', accession_number); 
    formData.append('ISBN', ISBN);
    formData.append('title', title);
    formData.append('edition', edition);
    formData.append('authors', authors);
    formData.append('copies_condition', copies_condition);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('subject_area', subject_area);
    formData.append('keywords', keywords);
    formData.append('imprint', imprint);
    formData.append('type_of_book', type_of_book);
    formData.append('summary', summary);
    formData.append('image', imageFile);

    console.log(formData)

    try {
        const response = await fetch('http://localhost:3000/updateBook', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            showDialog("Nice","Book updated successfully!");
            $('#contactForm').fadeOut();
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
            console.error('Error updating book:', error);
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
 

 console.log(userId);
 
 function cancel() {
     $('#contactForm').fadeOut();
 } 