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

document.addEventListener('DOMContentLoaded', () => {
    searchBorrowedBooks("");

    const searchInput = document.getElementById('searchInput1');

    // Add event listener for input events
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            searchBorrowedBooks("");
        } 
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            searchBorrowedBooks(searchTerm);
        }
    });

});

async function searchBorrowedBooks(searchTerm) {
    try {
        const response = await fetch('http://localhost:3000/searchBorrowedBooks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm }),
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
    const tableBody = document.getElementById('overdue_table');

    tableBody.innerHTML = '';

    borrowedBooks.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.borrowId}</td>
            <td>${book.accessionNumber}</td>
            <td>${book.isbn}</td>
            <td>${book.title}</td>
            <td>${book.userId}</td>
            <td>${book.username}</td>
            <td>${book.contactNumber}</td>
            <td>${book.email}</td>
            <td>${book.dueDate.split("T")[0]}</td>
            <td>${book.overdueDays}</td>
        `;

        tableBody.appendChild(row);
    });
}


fetchUserData();
async function fetchUserData() {
    try {
      const response = await fetch('http://localhost:3000/searchTouchnGo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify()
      });
      const data = await response.json();
      if (data.success) {
        updateUserDetails(data.pic[0]);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
   
function updateUserDetails(userData) {
  document.getElementById("image").src = "data:image/png;base64," + userData.profile_pic_base64;
  document.getElementById('image').alt="book cover";
  document.getElementById('image').width=100;
  document.getElementById('image').height=100;
  
  document.getElementById("imagePreview").src = "data:image/png;base64," + userData.profile_pic_base64;
  document.getElementById("imagePreview").style.display = "block";
  document.getElementById('placeholderIcon').style.display = 'none';
  document.getElementById('placeholderText').style.display = 'none';
}