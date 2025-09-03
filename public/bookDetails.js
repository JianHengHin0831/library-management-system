const userId = localStorage.getItem('user_id');
const isbn = localStorage.getItem('isbn');

getBookDetails();
async function getBookDetails() {
    try {
        const response = await fetch('http://localhost:3000/getBookDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isbn }), 
        }); 

        const data = await response.json();
  
        if (data.success) {  
            const book = data.bookDetails;
            const imageElement = document.getElementById('image');
            imageElement.src = `data:image/png;base64,${book.book_cover_base64}`;
            imageElement.alt = 'Book Image';
            document.getElementById('title').textContent = book.title;
            document.getElementById('authors').textContent = book.authors;
            document.getElementById('edition').textContent = book.edition;
            document.getElementById('publisher').textContent = book.publishers;
            document.getElementById('publicationDate').textContent = book.processing_date.split("T")[0];
            document.getElementById('imprint').textContent = book.imprint;
            document.getElementById('isbn').textContent = book.ISBN; 
            document.getElementById('subjectArea').textContent = book.subject_area;
            document.getElementById('typeOfBook').textContent = book.type_of_book;
            document.getElementById('location').textContent = book.location;
            document.getElementById('callNumber').textContent = book.call_number;
            document.getElementById('keywords').textContent = book.keywords;
            document.getElementById('available').textContent = book.available_copies;
            document.getElementById('summary1').textContent = book.summary;
            
        } else {
            console.error('Error getting book details:', data.message);
        }
    } catch (error) {
        console.error('Error getting book details:', error);
    }
}



async function reserveBook() {
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
            showDialog("Message", data.message);
            console.log('Book reserved successfully:', data.message);
        } else {
            showDialog("Error", data.message);
            console.error('Error reserving book:', data.message);
        }
    } catch (error) {
        console.error('Error reserving book:', error);
    }
}


function hideDialog() {
    document.getElementById("dialog").style.display = "none";
    window.location.reload();
    
  }
  
function showDialog(header,para) {
    var h2Element = document.querySelector('#dialog-content h2');
    var pElement = document.querySelector('#dialog-content p');
    
    // Changing the content
    h2Element.textContent = header;
    pElement.textContent = para;
    document.getElementById("dialog").style.display = 'block';
  } 


checkFavorites();
async function checkFavorites() {
    try {
        const response = await fetch('http://localhost:3000/checkFavorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, isbn })
        });

        const result = await response.json();

        if (result.success) {
            const heartIcon = document.getElementById('heartIcon');
            const favouriteButton = document.getElementById('favouriteButton');
            if (result.isFavorite) {
                heartIcon.style.color='red';
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }

            favouriteButton.classList.add('updated');
        } else {
            console.error('Failed to check favorite status.');
        }
    } catch (error) {
        console.error('Error checking favorite:', error);
    }
}

async function addToFavorites() {
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
            window.location.reload();
            console.log('Book added to favorites successfully:', data.message);
        } else {
            console.error('Error adding book to favorites:', data.message);
        }
    } catch (error) {
        console.error('Error adding book to favorites:', error);
    }
}

async function rateBook(rating) {
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


async function fetchAverageRating() {
    try {
        const response = await fetch('http://localhost:3000/average-rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isbn: isbn }) 
        });
        const data = await response.json();
        if (data.success) {
            updateRatingUI(data.averageRating);
        } else {
            console.error('Error fetching average rating:', data.message);
        }
    } catch (error) {
        console.error('Error fetching average rating:', error);
    }
}

function updateRatingUI(averageRating) {
    const rateElement = document.getElementById('rate');
    const rating = parseFloat(averageRating);

    rateElement.textContent = averageRating;

    const filledStars = Math.round(rating);

    for (let i = 1; i <= 5; i++) {
        const id = "star" + i;
        const starIcon = document.getElementById(id);
        starIcon.style.fontSize = '30px';
        if (i <= filledStars) {
            starIcon.style.color = '#C39A6F';
        } else {
            starIcon.style.color = 'grey';
        }
    }
}

function writeReview(){
    document.getElementById("review-textfield").style.display = "block"
    document.getElementById('write-btn').style.display = 'none';
}

function closeReview(){
    document.getElementById("review-textfield").style.display = "none"
    document.getElementById('write-btn').style.display = 'block';
}

window.addEventListener('DOMContentLoaded', fetchAverageRating);
window.addEventListener('DOMContentLoaded', fetchRatings);

async function fetchRatings() {
    console.log("???")
    try {
        const response = await fetch('http://localhost:3000/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isbn: isbn }) 
        });
        const data = await response.json();
        console.log(data)
        if (data.success) {
            console.log("scc")
            renderReviews(data.ratings);
        } else {
            console.error('Error fetching average rating:', data.message);
        }
    } catch (error) {
        console.error('Error fetching average rating:', error);
    }
}

function createReviewBox(review) {
    console.log(review);
    const reviewBox = document.createElement('div');
    reviewBox.classList.add('review-box', 'swiper-slide');

    const reviewerInfo = document.createElement('div');
    reviewerInfo.classList.add('reviewer-info');

    const profilePicture = document.createElement('div');
    profilePicture.classList.add('profilePicture');
    const bookImage = document.createElement('img');
    bookImage.src = `data:image/png;base64,${review.book_cover_base64}`;
    bookImage.style.width = '100%';
    bookImage.style.height = '100%';
    bookImage.style.borderRadius = '50%';
    bookImage.alt = 'User Picture';
    bookImage.classList.add('card-img');
    profilePicture.appendChild(bookImage);
    
    const reviewerDetails = document.createElement('div');
    reviewerDetails.classList.add('reviewer-details');

    const reviewerName = document.createElement('p');
    reviewerName.classList.add('reviewer-name');
    reviewerName.textContent = review.name;

    const course = document.createElement('p');
    course.classList.add('course');
    course.textContent = review.department;

    const indRating = document.createElement('div');
    indRating.classList.add('ind-rating');
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.classList.add('fa', 'fa-star');
        if (i < review.rating) {
            star.style.color = '#C39A6F'; 
        } else {
            star.style.color = 'grey';
        }
        indRating.appendChild(star);
    }

    reviewerDetails.appendChild(reviewerName);
    reviewerDetails.appendChild(course);
    reviewerDetails.appendChild(indRating);

    reviewerInfo.appendChild(profilePicture);
    reviewerInfo.appendChild(reviewerDetails);

    const reviewContent = document.createElement('p');
    reviewContent.classList.add('review-content');
    reviewContent.textContent = review.comments;
    reviewContent.style.overflowY = 'auto'; 
    reviewContent.style.maxHeight = '200px';

    reviewBox.appendChild(reviewerInfo);
    reviewBox.appendChild(reviewContent);

    return reviewBox;
}

function renderReviews(reviews) {
    const row2 = document.querySelector(".swiper-wrapper")
    row2.innerHTML = ''; 
    reviews.forEach(review => {
        const reviewBox = createReviewBox(review);
        row2.appendChild(reviewBox);
    });
}

    async function rateBook() {
        const comment = document.getElementById('reviewText').value;
        const indRating = document.getElementById('comment_rating');
        const stars = indRating.querySelectorAll('i.fa-star');
        
        let rating = 0;
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            console.log(star.style.color);
            if (star.style.color === 'rgb(195, 154, 111)') {
                rating++;
            } else {
                break;
            }
        }

        console.log(rating)
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
                window.location.reload(true);
            } else {
                console.error('Error rating book:', data.message);
            }
        } catch (error) {
            console.error('Error rating book:', error);
        }
    }

    function rateA(num) {
        for (let j = 1; j <= num; j++) {
            console.log('hi')
            const currentStar = document.getElementById(`overall-star${j}`);
            currentStar.style.color = '#C39A6F';
        }
        for (let j = num + 1; j <= 5; j++) {
            const currentStar = document.getElementById(`overall-star${j}`);
            currentStar.style.color = 'grey';
        }
    }

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