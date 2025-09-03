const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

function seeAllCurrent() {
window.location.href = "userCurrent.html"; 
}


function searchPage(){
    window.location.href = 'userSearch.html';
}
 
const userId = localStorage.getItem('user_id');
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
    const borrowBookList = document.querySelector('.borrowed-list');
    borrowedBooks.forEach(book => {
        const bookContainer = document.createElement('div');
        bookContainer.classList.add('borrow');

        const imageContentDiv = document.createElement('div');
        imageContentDiv.classList.add('image-content');

        const borrowImageDiv = document.createElement('div');
        borrowImageDiv.classList.add('borrow-image');

        const bookImage = document.createElement('img');
        bookImage.src = `data:image/png;base64,${book.book_cover_base64}`;
        bookImage.alt = 'book cover';
        bookImage.classList.add('borrow-img');

        borrowImageDiv.appendChild(bookImage);

        imageContentDiv.appendChild(borrowImageDiv);

        bookContainer.appendChild(imageContentDiv);

        const borrowContentTwoColDiv = document.createElement('div');
        borrowContentTwoColDiv.classList.add('borrow-content-twocol');

        const borrowContentDiv = document.createElement('div');
        borrowContentDiv.classList.add('borrow-content');

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('borrow-title');
        titleSpan.textContent = book.title;
        borrowContentDiv.appendChild(titleSpan);

        const authorsSpan = document.createElement('span');
        authorsSpan.classList.add('borrow-author');
        authorsSpan.textContent = `By: ${book.authors}`;
        borrowContentDiv.appendChild(authorsSpan);

        const borrowerSpan = document.createElement('span');
        borrowerSpan.classList.add('borrow-borrower');
        borrowerSpan.innerHTML = `Borrow Date: ${book.borrowDate.split("T")[0]}<br>Return Date: ${book.returnDate.split("T")[0]}`;
        borrowContentDiv.appendChild(borrowerSpan);

        borrowContentTwoColDiv.appendChild(borrowContentDiv);

        const borrowStatusDiv = document.createElement('div');
        borrowStatusDiv.classList.add('borrow-status');

        const viewDetailButton = document.createElement('button');
        viewDetailButton.classList.add('button');
        viewDetailButton.textContent = 'View Detail';

        viewDetailButton.addEventListener('click', async () => {
            localStorage.setItem('isbn',book.isbn);
            window.location.href = 'bookDetails.html'
        });

        borrowStatusDiv.appendChild(viewDetailButton);

        borrowContentTwoColDiv.appendChild(borrowStatusDiv);

        bookContainer.appendChild(borrowContentTwoColDiv);

        borrowBookList.appendChild(bookContainer);
    });

}

fetch('http://localhost:3000/getFavouriteBooks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        const favouriteBooks = data.favouriteBooks;
        const favouriteBookBlock = document.querySelector('.book-list');

        favouriteBooks.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');
        
            const imageContentDiv = document.createElement('div');
            imageContentDiv.classList.add('image-content');
        
            const bookImageDiv = document.createElement('div');
            bookImageDiv.classList.add('book-image');
            const bookImage = document.createElement('img');
            bookImage.src = `data:image/png;base64,${book.book_cover_base64}`;
            bookImage.alt = 'book cover';
            bookImage.classList.add('card-img');
            bookImageDiv.appendChild(bookImage);
        
            imageContentDiv.appendChild(bookImageDiv);
        
            bookDiv.appendChild(imageContentDiv);
        
            const bookContentDiv = document.createElement('div');
            bookContentDiv.classList.add('book-content');
        
            const titleSpan = document.createElement('span');
            titleSpan.classList.add('book-title');
            titleSpan.textContent = book.title;
            bookContentDiv.appendChild(titleSpan);
        
            const authorSpan = document.createElement('span');
            authorSpan.classList.add('book-author');
            authorSpan.textContent = book.authors;
            bookContentDiv.appendChild(authorSpan);
        
            bookDiv.appendChild(bookContentDiv);
        
            favouriteBookBlock.appendChild(bookDiv);

            
            bookDiv.addEventListener('click', async () =>  {
                    localStorage.setItem('isbn',book.isbn);
                    window.location.href = 'bookDetails.html'
                
            });
        });
        
    } else {
        console.error('Error fetching favourite books:', data.message);
    }
})
.catch(error => {
    console.error('Error fetching favourite books:', error);
});

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

            // updated (15/4/2024 4:47am)
            for (let i = 0; i < 5; i++) {
                const starIcon = document.createElement('i');
                starIcon.classList.add('bx', 'bxs-star', 'icon');
                starIcon.style.color = '#C39A6F';                if (i < book.rating) {
                starRatingDiv.appendChild(starIcon);
                } else {
                    const emptyStarIcon = document.createElement('i');
                    emptyStarIcon.classList.add('bx', 'bxs-star', 'icon');
                    emptyStarIcon.style.color = '#D9D9D9';
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
                window.location.href = 'bookDetails.html'
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