document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const subjectSelect = document.getElementById('subjectSelect');
    const typeSelect = document.getElementById('typeSelect');
    const authorSelect = document.getElementById('authorSelect');
    const keywordsSelect = document.getElementById('keywordsSelect');
    const publisherSelect = document.getElementById('publishersSelect');
    const selectedOptions = document.getElementById('selectedOptions');
    const searchButton = document.querySelector('.search-button-block button');

    // Add event listener to search button
    searchButton.addEventListener('click', search);

    // Event listeners for selects
    subjectSelect.addEventListener('change', addOption)
    typeSelect.addEventListener('change', addOption);
    authorSelect.addEventListener('change', addOption);
    keywordsSelect.addEventListener('change', addOption);
    publisherSelect.addEventListener('change', addOption); 

    // function addOption(event) {
    //     const selectedOption = event.target.value; 
    //     if (selectedOption) {
    //         const optionText = event.target.options[event.target.selectedIndex].text;
    
    //         // Always add the option regardless of existence
    //         const optionElement = document.createElement('span');
    //         optionElement.textContent = optionText;
    //         optionElement.classList.add('selectedOption');
    //         optionElement.setAttribute('data-value', selectedOption);
    //         optionElement.addEventListener('click', removeOption);
    //         selectedOptions.appendChild(optionElement);
            
    //         optionElement.style.display = 'flex';
    //         optionElement.style.width = 'auto';
    //         optionElement.style.height = '32px';
    //         optionElement.style.border = '2px solid #C39A6F'; 
    //         optionElement.style.fontSize = '18px';
    //         optionElement.style.padding = '8px 10px';
    //         optionElement.style.margin = '10px 5px';
    //         optionElement.style.fontSize = '18px';
    //         optionElement.style.borderRadius = '20px';  
    //         optionElement.style.color = '#00557F'; 

    //     }
    // }
    
    // function removeOption(event) {
    //     const optionValue = event.target.getAttribute('data-value');
    //     const optionToRemove = selectedOptions.querySelector(`[data-value="${optionValue}"]`);
    //     if (optionToRemove) {
    //         selectedOptions.removeChild(optionToRemove);
    //     }
    // }
    
    // UPDATED 20/4/2024 12:26AM
    function addOption(event) {
        const selectedOption = event.target.value;
        if (selectedOption) {
            const optionText = event.target.options[event.target.selectedIndex].text;
    
            const optionElement = document.createElement('span');
            optionElement.textContent = optionText;
            optionElement.classList.add('selectedOption');
            optionElement.setAttribute('data-value', selectedOption);
            selectedOptions.appendChild(optionElement);
    
            const closeIcon = document.createElement('i');
            closeIcon.classList.add('bx', 'bx-x');
            closeIcon.addEventListener('click', function() {
                removeOption(optionElement);
            });
    
            optionElement.appendChild(closeIcon);
    
            setOptionStyle(optionElement);
            moveOptionsToNextRow();
            
            console.log('Option added:', selectedOption);
        }
    }
    

    function setOptionStyle(optionElement) {
        optionElement.style.display = 'inline-flex';
        optionElement.style.height = '32px';
        optionElement.style.border = '2px solid #C39A6F';
        optionElement.style.fontSize = '18px';
        optionElement.style.padding = '8px 10px';
        optionElement.style.margin = '10px 5px';
        optionElement.style.borderRadius = '20px';
        optionElement.style.color = '#00557F';
        optionElement.style.whiteSpace = 'nowrap';
    }

    function moveOptionsToNextRow() {
        const options = selectedOptions.querySelectorAll('.selectedOption');
        let totalWidth = 0;
        const rowWidth = selectedOptions.offsetWidth * 0.9; // 90% of selectedOptions width

        let currentRow = document.createElement('div');
        currentRow.classList.add('optionRow');
        selectedOptions.appendChild(currentRow);

        options.forEach(option => {
            totalWidth += option.offsetWidth;

            if (totalWidth > rowWidth) {
                currentRow = document.createElement('div');
                currentRow.classList.add('optionRow');
                selectedOptions.appendChild(currentRow);

                currentRow.appendChild(option);
                totalWidth = option.offsetWidth;
            } else {
                currentRow.appendChild(option);
            }
        });
    }

    function removeOption(optionElement) {
        if (optionElement && optionElement.classList.contains('selectedOption')) {
            const optionValue = optionElement.getAttribute('data-value');
            const optionToRemove = selectedOptions.querySelector(`span[data-value="${optionValue}"]`);
            
            if (optionToRemove) {
                optionToRemove.remove();
                moveOptionsToNextRow();
                console.log('Option remove:', optionElement);
    
                // Remove empty rows
                selectedOptions.querySelectorAll('.optionRow').forEach(row => {
                    if (!row.hasChildNodes()) {
                        row.parentNode.removeChild(row);
                    }
                });  
            }
        }
    }
    
    search();
    async function search() {
        const query = searchInput.value;
        if(query!=""){
            try {
            const response = await fetch('http://localhost:3000/insertSearchQuery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId:userId, query: query })
            });

            if (!response.ok) {
                throw new Error('Failed to insert search query');
            }
            } catch (error) {
                console.error('Error inserting search query:', error);
            }
        }


        const selectedOptionValues = Array.from(selectedOptions.querySelectorAll('.selectedOption')).map(option => option.getAttribute('data-value'));

        let selectedFilters = [];

        // Check for each selectedOptionValue and push into selectedFilters if exists in dropdown
        selectedOptionValues.forEach(selectedValue => {
            if (selectedValue) {
                // Check if the value exists in the subjectSelect dropdown
                if (subjectSelect.querySelector(`option[value="${selectedValue}"]`)) {
                    selectedFilters.push({ field: 'subject_area', value: selectedValue });
                }

                // Check if the value exists in the typeSelect dropdown
                if (typeSelect.querySelector(`option[value="${selectedValue}"]`)) {
                    selectedFilters.push({ field: 'type_of_book', value: selectedValue });
                }

                // Check if the value exists in the publisherSelect dropdown
                if (publisherSelect.querySelector(`option[value="${selectedValue}"]`)) {
                    selectedFilters.push({ field: 'publishers', value: selectedValue });
                }

                // Check if the value exists in the authorSelect dropdown
                if (authorSelect.querySelector(`option[value="${selectedValue}"]`)) {
                    selectedFilters.push({ field: 'authors', value: selectedValue });
                }

                // Check if the value exists in the keywordsSelect dropdown
                if (keywordsSelect.querySelector(`option[value="${selectedValue}"]`)) {
                    selectedFilters.push({ field: 'keywords', value: selectedValue });
                }
            }
        });


        // selectedOptionElements.forEach(optionElement => {
        //     const optionValue = optionElement.getAttribute('data-value');
        //     const [field, value] = optionValue.split(':'); // �녺┿ field �� value
        //     selectedFilters.push({ field, value });
        // });
    
        try {
            const response = await fetch('http://localhost:3000/searchBooksA', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchInput: searchInput.value, selectedFilters }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                const bookDetails = data.books;
                clearResult(); 
                displayBooks(bookDetails);
            } else {
                console.error('Error searching books:', data.message);
            }
        } catch (error) {
            console.error('Error searching books:', error);
        }
    }
    
    
    function clearResult() {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';
    }
    
    function displayBooks(books) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; 

    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <div class="image-content">
                <div class="book-image">
                    <img src="data:image/png;base64,${book.book_cover_base64}" alt="book cover" class="card-img">
                </div>
            </div>
            <div class="book-content">
                <span class="book-title">${book.title}</span>
                <span class="book-author">Authors: ${book.authors}</span>
                <button class="view-button">View Book</button>
            </div>
        `;
        bookElement.addEventListener('click', () => {
            localStorage.setItem('isbn',book.ISBN);
            window.location.href = 'adminBookDetails.html'
        });

        // const viewButton = document.createElement('button');
        // viewButton.classList.add('view-button');
        // viewButton.textContent = 'View Book';
        // cardContentDiv.appendChild(viewButton);

        // viewButton.addEventListener('click', async () => {
        //     localStorage.setItem('isbn',book.ISBN);
        //     window.location.href = 'bookDetails.html'
        // });

        resultDiv.appendChild(bookElement);
    });
}

const searchHistoryDropdown = document.getElementById('searchHistoryDropdown');

document.addEventListener('click', function closeDropdown(event) {
    console.log("hi")
    if (!searchHistoryDropdown.contains(event.target)) {
        searchHistoryDropdown.style.display = 'none';
    }
});

function showBookDetails(book) {
    const isbn = book.ISBN;
    let averageRating = '';

    fetch('http://localhost:3000/average-rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isbn })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data.averageRating);
            averageRating = data.averageRating;

            updateContactForm(book, averageRating);
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching average rating:', error);
    });
}

function updateContactForm(book, averageRating) {
    const contactForm = document.getElementById('contactForm');
    contactForm.innerHTML = '';

    contactForm.innerHTML = `
        <img src="data:image/png;base64,${book.book_cover_base64}" alt="book cover" class="img1" style="height: 100px;">
        <h2>${book.title}</h2>
        <p>Authors: ${book.authors}</p>
        <p>Available Copies: ${book.available_copies}</p>
        <p>ISBN: ${book.ISBN}</p>
        <p>Edition: ${book.edition}</p>
        <p>Price: ${book.price}</p>
        <p>Location: ${book.location}</p>
        <p>Subject Area: ${book.subject_area}</p>
        <p>Keywords: ${book.keywords}</p>
        <p>Imprint: ${book.imprint}</p>
        <p>Call Number: ${book.call_number}</p>
        <p>Type of Book: ${book.type_of_book}</p>
    `;

    contactForm.appendChild(createStarRating(averageRating));

    contactForm.innerHTML += `
        <p>Rating: ${averageRating}</p>
        
    `;
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');
    actionsDiv.innerHTML = `
        <button id="reserve1">Reserve</button>
        <button id="favourite1">Add to Favorites</button>
    `;
    contactForm.appendChild(actionsDiv);

    const ratingStarsDiv = document.createElement('div');
    ratingStarsDiv.id = 'rating-stars';
    ratingStarsDiv.innerHTML = `
        <span class="star" id="star1">��</span>
        <span class="star" id="star2">��</span>
        <span class="star" id="star3">��</span>
        <span class="star" id="star4">��</span>
        <span class="star" id="star5">��</span>
    `;
    contactForm.appendChild(ratingStarsDiv);

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'comment';
    inputElement.placeholder = 'Enter your comment here...';

    contactForm.appendChild(inputElement);

    const cancelDiv = document.createElement('div');
    cancelDiv.classList.add('cancel');
    cancelDiv.innerHTML = `
        <button id="cancel1">Close</button>
    `;
    contactForm.appendChild(cancelDiv);


    document.getElementById('cancel1').onclick = function() {
        cancel();
    };

    document.getElementById('reserve1').onclick = function() {
        reserveBook(book.ISBN);
    };
    document.getElementById('favourite1').onclick = function() {
        addToFavorites(book.ISBN);
    };
    document.getElementById('star1').onclick = function() {
        rateBook(book.ISBN, 1);
    };
    document.getElementById('star2').onclick = function() {
        rateBook(book.ISBN, 2);
    };
    document.getElementById('star3').onclick = function() {
        rateBook(book.ISBN, 3);
    };
    document.getElementById('star4').onclick = function() {
        rateBook(book.ISBN, 4);
    };
    document.getElementById('star5').onclick = function() {
        rateBook(book.ISBN, 5);
    };


    $('#contactForm').fadeToggle();
}

function cancel() {
    $('#contactForm').fadeOut();
} 


function createStarRating(rating) {
    const roundedRating = Math.round(rating); 
    const starContainer = document.createElement('div');
    starContainer.classList.add('star-container');

    const filledStars = Math.min(5, roundedRating);
    const emptyStars = Math.max(0, 5 - filledStars); 

    for (let i = 0; i < filledStars; i++) {
        const star = document.createElement('span');
        star.classList.add('star', 'filled');
        star.innerHTML = '&#9733;'; 
        starContainer.appendChild(star);
    }

    for (let i = 0; i < emptyStars; i++) {
        const star = document.createElement('span');
        star.classList.add('star', 'empty');
        star.innerHTML = '&#9734;';
        starContainer.appendChild(star);
    }

    return starContainer;
}

    
    
    async function reserveBook(isbn) {
        try {
            const response = await fetch('http://localhost:3000/reserveBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, isbn }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Book reserved successfully:', data.message);
            } else {
                console.error('Error reserving book:', data.message);
            }
        } catch (error) {
            console.error('Error reserving book:', error);
        }
    }

    async function addToFavorites(isbn) {
        try {
            const response = await fetch('http://localhost:3000/addToFavorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, isbn }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Book added to favorites successfully:', data.message);
            } else {
                console.error('Error adding book to favorites:', data.message);
            }
        } catch (error) {
            console.error('Error adding book to favorites:', error);
        }
    }

    async function rateBook(isbn, rating) {
        const comment = document.getElementById('comment').value;
        try {
            const response = await fetch('http://localhost:3000/rateBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, isbn, rating,comment }),
            });

            const data = await response.json();

            if (data.success) {
                console.log('Book rated successfully:', data.message);
            } else {
                console.error('Error rating book:', data.message);
            }
        } catch (error) {
            console.error('Error rating book:', error);
        }
    }



});


 

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

async function populateDropdowns() {
    try {
        const response = await fetch('http://localhost:3000/searchBookUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const data = await response.json();

        populateDropdown('subjectSelect', data.distinctSubjectAreas);
        populateDropdown('authorSelect', data.distinctAuthors);
        populateDropdown('keywordsSelect', data.distinctKeywords);
        populateDropdown('typeSelect', data.distinctTypesOfBook);
        populateDropdown('publishersSelect', data.distinctPublishers);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    //dropdown.innerHTML = '<option value="">Select...</option>';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
});

async function showSearchHistory() {
    const searchBar = document.getElementById('searchInput');
    const searchHistoryDropdown = document.getElementById('searchHistoryDropdown');
    searchHistoryDropdown.innerHTML = ''; 

    try {
        const response = await fetch(`http://localhost:3000/getSearchHistory/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch search history');
        }

        const searchHistory = await response.json();

        if (searchHistory.length > 0) {
            searchHistoryDropdown.style.display = 'block';
            searchHistory.forEach(item => {
                const option = document.createElement('div');
                option.textContent = item.search_query;
                option.classList.add('searchHistoryItem');
                option.addEventListener('click', () => selectSearchQuery(item.search_query));
                searchHistoryDropdown.appendChild(option);
            });
        } else {
            searchHistoryDropdown.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching search history:', error);
    }

    document.body.addEventListener('click', function(event) {
    const target = event.target;
    if (target !== searchBar && !searchHistoryDropdown.contains(target)) {
        searchHistoryDropdown.style.display = 'flex';
    }
});
}

function selectSearchQuery(query) {
    document.getElementById('searchInput').value = query;
    document.getElementById('searchHistoryDropdown').style.display = 'none';
}
document.getElementById('searchInput').addEventListener('click', showSearchHistory);

function toggleFilterDropdown(){
    const dropdown = document.getElementById("filterDropdown");
    if(dropdown.style.display === 'none'){
        dropdown.style.display = 'flex';
    }else{
        dropdown.style.display = 'none';
    }
    
}
