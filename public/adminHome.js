const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');
const body = document.querySelector("body");
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle");

// -------------------- MOST BORROWED BOOK START
fetch('http://localhost:3000/getMostBorrowedBooks', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
})
.then(response => response.json())
.then(data => { 
    if (data.success) {
        const borrowedBooks = data.borrowedBooks;
        const bookList = document.querySelector('.book-list');

        borrowedBooks.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const imageContentDiv = document.createElement('div');
            imageContentDiv.classList.add('image-content');

            const bookImageDiv = document.createElement('div');
            bookImageDiv.classList.add('book-image');

            const bookImage = document.createElement('img');
            bookImage.src = `data:image/png;base64,${book.book_cover_base64}`;
            bookImage.alt = 'Book Cover';
            bookImage.classList.add('card-img');
            bookImageDiv.appendChild(bookImage); 

            imageContentDiv.appendChild(bookImageDiv);
            bookDiv.appendChild(imageContentDiv);

            const bookContentDiv = document.createElement('div');
            bookContentDiv.classList.add('book-content');

            const bookTitle = document.createElement('span');
            bookTitle.classList.add('book-title');
            bookTitle.textContent = book.title;
            bookContentDiv.appendChild(bookTitle);

            const bookAuthor = document.createElement('span');
            bookAuthor.classList.add('book-author');
            bookAuthor.textContent = book.authors;
            bookContentDiv.appendChild(bookAuthor);

            bookDiv.appendChild(bookContentDiv);

            bookDiv.addEventListener('click', async () => {
                localStorage.setItem('isbn',book.ISBN);
                window.location.href = 'adminBookDetails.html'
            });

            bookList.appendChild(bookDiv);
        });
    } else {
        console.error('Error fetching MOST BORROWED books:', data.message);
    }
})
.catch(error => {
    console.error('Error fetching MOST BORROWED books:', error);
});
// // -------------------- MOST BORROWED BOOK END


// --------------------RECOMMENDED BOOK START
// -------------------- RECOMMENDATION OF THE WEEK START
fetch('http://localhost:3000/getRecommendedBooks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        const recommendedBooks = data.recommendedBooks;
        const recommendationBlock = document.querySelector('.swiper-wrapper');

        recommendedBooks.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('card');
            bookDiv.classList.add('swiper-slide');

            const imageContentDiv = document.createElement('div');
            imageContentDiv.classList.add('image-content');

            const cardImageDiv = document.createElement('div');
            cardImageDiv.classList.add('card-image');

            const bookImage = document.createElement('img');
            bookImage.src = `data:image/png;base64,${book.book_cover_base64}`;
            bookImage.alt = 'Book Cover';
            bookImage.classList.add('card-img');
            cardImageDiv.appendChild(bookImage);

            imageContentDiv.appendChild(cardImageDiv);
            bookDiv.appendChild(imageContentDiv);

            const cardContentDiv = document.createElement('div');
            cardContentDiv.classList.add('card-content');

            const bookTitle = document.createElement('h2');
            bookTitle.classList.add('book-name');
            bookTitle.textContent = book.title;
            cardContentDiv.appendChild(bookTitle);

            const bookAuthor = document.createElement('h3');
            bookAuthor.classList.add('book-author');
            bookAuthor.textContent = book.authors;
            cardContentDiv.appendChild(bookAuthor);

            const bookRecommend = document.createElement('p');
            bookRecommend.classList.add('book-recommend');
            bookRecommend.textContent = `Recommendation by ${book.recommended_by}`;
            cardContentDiv.appendChild(bookRecommend);


            const starRatingDiv = document.createElement('div');
            starRatingDiv.classList.add('star-rating');

            for (let i = 0; i < 5; i++) {
                const starIcon = document.createElement('i');
                starIcon.classList.add('bx', 'bxs-star', 'icon');
                starIcon.style.color = '#C39A6F';
                if (i < book.rating) {
                    starRatingDiv.appendChild(starIcon);
                } else {
                    const emptyStarIcon = document.createElement('i');
                    emptyStarIcon.classList.add('bx', 'bxs-star', 'icon');
                    emptyStarIcon.style.color = '#D9D9D9';  // Set the color for the empty star
                    starRatingDiv.appendChild(emptyStarIcon);
                }
            }

            cardContentDiv.appendChild(starRatingDiv);

            const viewButton = document.createElement('button');
            viewButton.classList.add('button');
            viewButton.textContent = 'View Book';
            cardContentDiv.appendChild(viewButton);

            viewButton.addEventListener('click', async () => {
                localStorage.setItem('isbn',book.ISBN);
                window.location.href = 'adminBookDetails.html'
            });

            bookDiv.appendChild(cardContentDiv);

            recommendationBlock.appendChild(bookDiv);
        });

        // Initialize Swiper after adding all cards
        new Swiper('.swiper', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
            },
        });
    } else {
        console.error('Error fetching RECOMMENDED books:', data.message);
    }
})
.catch(error => {
    console.error('Error fetching RECOMMENDED books:', error);
});
// // -------------------- RECOMMENDATION OF THE WEEK END

// --------------------RECOMMENDED BOOK END

// --------------------TODAY BORROWED START

fetch('http://localhost:3000/getTodayBorrowedBooks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        const borrowedBooks = data.borrowedBooks;
        const borrowedList = document.querySelector('.borrowed-list');

        borrowedList.innerHTML = '';  // Clear the borrowed list

        borrowedBooks.forEach(book => {
            const borrowDiv = document.createElement('div');
            borrowDiv.classList.add('borrow');

            const borrowThreeColDiv = document.createElement('div');
            borrowThreeColDiv.classList.add('borrow-threecol');

            const imageContentDiv = document.createElement('div');
            imageContentDiv.classList.add('image-content');

            const borrowImageDiv = document.createElement('div');
            borrowImageDiv.classList.add('borrow-image');

            const borrowImage = document.createElement('img');
            borrowImage.src = `data:image/png;base64,${book.book_cover_base64}`;
            borrowImage.alt = 'Book Cover';
            borrowImage.classList.add('borrow-img');
            borrowImageDiv.appendChild(borrowImage);

            imageContentDiv.appendChild(borrowImageDiv);
            borrowThreeColDiv.appendChild(imageContentDiv);

            const borrowContentTwoColDiv = document.createElement('div');
            borrowContentTwoColDiv.classList.add('borrow-content-twocol');

            const borrowContentDiv = document.createElement('div');
            borrowContentDiv.classList.add('borrow-content');

            const borrowTitle = document.createElement('span');
            borrowTitle.classList.add('borrow-title');
            borrowTitle.textContent = book.title;
            borrowContentDiv.appendChild(borrowTitle);

            const borrowAuthor = document.createElement('span');
            borrowAuthor.classList.add('borrow-author');
            borrowAuthor.textContent = `By: ${book.authors}`;
            borrowContentDiv.appendChild(borrowAuthor);

            const borrowBorrower = document.createElement('span');
            borrowBorrower.classList.add('borrow-borrower');
            borrowBorrower.textContent = `Borrower: ${book.userId}`;
            borrowContentDiv.appendChild(borrowBorrower);

            borrowContentTwoColDiv.appendChild(borrowContentDiv);

            const borrowStatusDiv = document.createElement('div');
            borrowStatusDiv.classList.add('borrow-status');

            const statusBar = document.createElement('span');
            statusBar.classList.add('status-bar');
            statusBar.textContent = 'Borrowed';
            borrowStatusDiv.appendChild(statusBar);

            borrowContentTwoColDiv.appendChild(borrowStatusDiv);

            borrowThreeColDiv.appendChild(borrowContentTwoColDiv);

            borrowDiv.appendChild(borrowThreeColDiv);

            borrowedList.appendChild(borrowDiv);
        });
    } else {
        console.error('Error fetching TODAY BORROWED books:', data.message);
    }
})
.catch(error => {
    console.error('Error fetching TODAY BORROWED books:', error);
});
// // -------------------- TODAY BORROWED END

// -------------------- TODAY RETURNED START
fetch('http://localhost:3000/getTodayReturnedBooks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        const returnedBooks = data.returnedBooks;  // Updated variable name to reflect returned books
        const returnedList = document.querySelector('.returned-list');

        returnedList.innerHTML = '';  // Clear the returned list

        returnedBooks.forEach(book => {
            const returnDiv = document.createElement('div');
            returnDiv.classList.add('return');

            const returnThreeColDiv = document.createElement('div');
            returnThreeColDiv.classList.add('return-threecol');

            const imageContentDiv = document.createElement('div');
            imageContentDiv.classList.add('image-content');

            const returnImageDiv = document.createElement('div');
            returnImageDiv.classList.add('return-image');

            const returnImage = document.createElement('img');
            returnImage.src = `data:image/png;base64,${book.book_cover_base64}`;
            returnImage.alt = 'Book Cover';
            returnImage.classList.add('return-img');
            returnImageDiv.appendChild(returnImage);

            imageContentDiv.appendChild(returnImageDiv);
            returnThreeColDiv.appendChild(imageContentDiv);

            const returnContentTwoColDiv = document.createElement('div');
            returnContentTwoColDiv.classList.add('return-content-twocol');

            const returnContentDiv = document.createElement('div');
            returnContentDiv.classList.add('return-content');

            const returnTitle = document.createElement('span');
            returnTitle.classList.add('return-title');
            returnTitle.textContent = book.title;
            returnContentDiv.appendChild(returnTitle);

            const returnAuthor = document.createElement('span');
            returnAuthor.classList.add('return-author');
            returnAuthor.textContent = `By: ${book.authors}`;
            returnContentDiv.appendChild(returnAuthor);

            const returnBorrower = document.createElement('span');
            returnBorrower.classList.add('return-borrower');
            returnBorrower.textContent = `Borrower: ${book.userId}`;
            returnContentDiv.appendChild(returnBorrower);

            returnContentTwoColDiv.appendChild(returnContentDiv);

            const returnStatusDiv = document.createElement('div');
            returnStatusDiv.classList.add('return-status');

            const statusBar = document.createElement('span');
            statusBar.classList.add('status-bar');
            statusBar.textContent = 'Returned';
            returnStatusDiv.appendChild(statusBar);

            returnContentTwoColDiv.appendChild(returnStatusDiv);

            returnThreeColDiv.appendChild(returnContentTwoColDiv);

            returnDiv.appendChild(returnThreeColDiv);

            returnedList.appendChild(returnDiv);
        });
    } else {
        console.error('Error fetching TODAY RETURNED books:', data.message);
    }
})
.catch(error => {
    console.error('Error fetching TODAY RETURNED books:', error);
});
// -------------------- TODAY RETURNED END

// --------------------TODAY RETURNED END

function expand() {
    const sidebar = document.querySelector('.sidebar');
    const contentSection = document.querySelector('main');
    const bookList = document.querySelector('.most-borrowed .book-list'); // Add this line

    contentSection.classList.toggle('expand');
    const menuText = document.querySelectorAll('.text');
    menuText.forEach(function(text, index){
    setTimeout(() => {
        text.classList.toggle('open2');
    }, index * 50);
})
    sidebar.classList.toggle("close");

    // Toggle display of .most-borrowed .book-list
    if (contentSection.classList.contains('expand')) {
        bookList.style.display = 'grid';
    } else {
        bookList.style.display = 'grid';
        
    }
}; 