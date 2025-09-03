// -------------------- SEARCH BOOK START
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
        const recommendationBlock = document.querySelector('.book-list');

        recommendedBooks.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const imageContentDiv = document.createElement('div');
            imageContentDiv.classList.add('image-content');

            const cardImageDiv = document.createElement('div');
            cardImageDiv.classList.add('book-image');

            const bookImage = document.createElement('img');
            bookImage.src = book.book_cover; // Use the book_cover column from the database
            bookImage.alt = 'Book Cover';
            bookImage.classList.add('card-img');
            cardImageDiv.appendChild(bookImage);

            imageContentDiv.appendChild(cardImageDiv);
            bookDiv.appendChild(imageContentDiv);

            const cardContentDiv = document.createElement('div');
            cardContentDiv.classList.add('book-content');

            const bookTitle = document.createElement('h2');
            bookTitle.classList.add('book-title');
            bookTitle.textContent = book.title;
            cardContentDiv.appendChild(bookTitle);

            const bookAuthor = document.createElement('h3');
            bookAuthor.classList.add('book-author');
            bookAuthor.textContent = book.authors;
            cardContentDiv.appendChild(bookAuthor);

            const viewButton = document.createElement('button');
            viewButton.classList.add('view-button');
            viewButton.textContent = 'View Book';
            cardContentDiv.appendChild(viewButton);

            viewButton.addEventListener('click', async () => {
                localStorage.setItem('isbn',book.ISBN);
                window.location.href = 'bookDetails.html'
            });

            bookDiv.appendChild(cardContentDiv);

            recommendationBlock.appendChild(bookDiv);
        });
    } else {
        console.error('Error fetching SEARCHED books:', data.message);
    }
})
.catch(error => {
    console.error('Error fetching SEARCHED books:', error);
});
// // -------------------- SEARCH BOOK END