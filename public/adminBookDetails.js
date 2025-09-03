const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

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


const uploadButton = document.getElementById('uploadDetail');
const fileInput = document.getElementById('fileInput');
const imageElement = document.getElementById('image');

uploadButton.addEventListener('click', function() {
    fileInput.click();
});

fileInput.addEventListener('change', function() {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        const imageURL = URL.createObjectURL(selectedFile);
        imageElement.src = imageURL;
    }
});


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
            document.getElementById('title').value = book.title;
            document.getElementById('authors').value = book.authors;
            document.getElementById('edition').value = book.edition;
            document.getElementById('publisher').value = book.publishers;
            document.getElementById('publicationDate').value = book.processing_date.split("T")[0];
            document.getElementById('imprint').value = book.imprint;
            document.getElementById('isbn').value = book.ISBN; 
            document.getElementById('subjectArea').value = book.subject_area;
            document.getElementById('typeOfBook').value = book.type_of_book;
            document.getElementById('location').value = book.location;
            document.getElementById('callNumber').value = book.call_number;
            addOption(book.keywords)
            document.getElementById('summary').value = book.summary;
              
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
            console.log('Book reserved successfully:', data.message);
        } else {
            console.error('Error reserving book:', data.message);
        }
    } catch (error) {
        console.error('Error reserving book:', error);
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
            if (star.style.color === '#C39A6F') {
                rating++;
            } else {
                break;
            }
        }

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


const keywordsInput = document.getElementById('keywords');

keywordsInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addOption(keywordsInput.value);
        keywordsInput.value="";
    }
}); 

function addOption(optionTextStr) {
    const optionArray = optionTextStr.split(',');

    optionArray.forEach(optionText => {
        const optionElement = document.createElement('span');
        optionElement.classList.add('selectedOption');

        const closeIcon = document.createElement('span');
        closeIcon.classList.add('close-icon');
        closeIcon.textContent = '×'; 

        closeIcon.addEventListener('click', () => {
            removeOption(optionElement);
        });

        optionElement.textContent = optionText.trim();
        optionElement.appendChild(closeIcon);

        document.getElementById("keyword-area").appendChild(optionElement);

    });
}



function removeOption(event) {
    document.getElementById("keyword-area").removeChild(event);
}

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
    const title = document.getElementById('title').value
    const authors = document.getElementById('authors').value
    const edition = document.getElementById('edition').value
    const publisher = document.getElementById('publisher').value 
    const publicationDate = document.getElementById('publicationDate').value 
    const imprint = document.getElementById('imprint').value
    const isbn = document.getElementById('isbn').value  
    const location = document.getElementById('location').value 
    const callNumber = document.getElementById('callNumber').value 
    const summary = document.getElementById('summary').value;
    const subjectAreaElement = document.getElementById('subjectArea');
    const subjectArea = subjectAreaElement.options[subjectAreaElement.selectedIndex].value;
    const typeOfBookElement = document.getElementById('typeOfBook');
    const typeOfBook = typeOfBookElement.options[typeOfBookElement.selectedIndex].value;
    const keywordsElements = document.querySelectorAll('#keyword-area .selectedOption');
    const keywordsArray = Array.from(keywordsElements).map(element => element.textContent.trim().slice(0, -1));
    const keywords = keywordsArray.join(', ');

    const image = document.getElementById('image').src;
    imageFile = await fetchImageAsFile(image); 
    
 
    const formData = new FormData();
    formData.append('title', title);
    formData.append('authors', authors);
    formData.append('edition', edition);
    formData.append('publisher', publisher);
    formData.append('publicationDate', publicationDate);
    formData.append('imprint', imprint);
    formData.append('isbn', isbn);
    formData.append('location', location);
    formData.append('callNumber', callNumber);
    formData.append('summary', summary);
    formData.append('subjectArea', subjectArea);
    formData.append('typeOfBook', typeOfBook);
    formData.append('keywords', keywords);
    formData.append('image', imageFile);

    console.log(formData)

    try {
        const response = await fetch('http://localhost:3000/updateBook', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            window.location.reload(true)
        } else {
            showDialog("Error",result.message)
        }
    } catch (error) {
            console.error('Error updating book:', error);
            showDialog("Error","Please try again");
    }


}