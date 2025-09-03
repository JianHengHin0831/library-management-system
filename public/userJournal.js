const userId = localStorage.getItem('user_id'); 

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
        window.location.href = 'AdminBorrow.html'
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
        window.location.href = 'adminAcqTable.html'
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

// --------------------SIDEBAR MENU END

// -------------------- 2ROW SELECTION START

async function fetchProfPic(userId, newBlock) {
    try {
        const response = await fetch('http://localhost:3000/searchProfilePic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
            const profilePicBase64 = data.pic[0].profile_pic_base64;
            const imgElement = document.createElement('img');
            imgElement.src = `data:image/png;base64, ${profilePicBase64}`;
            imgElement.style.width = '35px';
            imgElement.style.height = '35px';
            imgElement.style.marginLeft = '8px';
            imgElement.alt = 'Profile Picture';
            imgElement.style.borderRadius = '50%';

            // Fetch the user's name
            const nameLabel = document.createElement('label');
            const responseName = await fetch('http://localhost:3000/findNameA', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }), 
            });
            const dataName = await responseName.json();
            if (dataName.success) {
                const totalFines = dataName.borrowedBooksCount;
                nameLabel.textContent = `${totalFines}`;
                nameLabel.style.marginTop = '7px'; // Adjust the margin-top
            } else {
                console.error('Error retrieving user name:', dataName.message);
            }

            // Create a flex container for nameLabel and imgElement
            const flexContainer = document.createElement('div');
            flexContainer.style.display = 'flex';
            flexContainer.style.alignItems = 'center'; // Align items vertically
            flexContainer.appendChild(imgElement);
            flexContainer.appendChild(nameLabel);
            newBlock.appendChild(flexContainer);

        } else {
            console.error('Error fetching profile picture:', data.message);
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
}

function populateJournalBlocks(journal) {
    const container = document.getElementById('journalContainer');
    container.innerHTML = ''; 

    journal.forEach(async journal => {
        
        const newBlock = document.createElement('div');
        newBlock.classList.add('journal-block'); 

        const imageContentDiv = document.createElement('div');
        imageContentDiv.classList.add('image-content');
        imageContentDiv.style.height = '243px'; 
        imageContentDiv.style.borderRadius = '15px';
    
        const bookImageDiv = document.createElement('div');
        bookImageDiv.classList.add('book-image');
        const bookImage = document.createElement('img');
        bookImage.src = `data:image/png;base64,${journal.cover}`;
        bookImage.alt = 'book cover';
        bookImage.classList.add('card-img');
        bookImage.style.width = '100%';
        bookImage.style.aspectRatio = '3/2';
        bookImage.style.objectFit = 'cover'; 
        bookImage.style.borderRadius = '15px';
        bookImageDiv.appendChild(bookImage);
    
        imageContentDiv.appendChild(bookImageDiv);
        newBlock.appendChild(imageContentDiv);

        if (journal.url) {
            const urlLabel = document.createElement('label');
            urlLabel.textContent = 'URL: '; 

            const urlLink = document.createElement('a');
            urlLink.textContent = journal.url; 
            urlLink.href = journal.url;
            urlLink.target = "_blank"; 

            // newBlock.appendChild(urlLabel);
            // newBlock.appendChild(urlLink);
        }

        

        const keywordsLabel = document.createElement('label');
        keywordsLabel.textContent = `${journal.keywords}`;
        keywordsLabel.style.fontSize ='30px';
        keywordsLabel.style.lineHeight = '1.5';
        newBlock.appendChild(keywordsLabel);

        const authorLabel = document.createElement('label');
        authorLabel.textContent = `Author: ${journal.author}`;
        newBlock.appendChild(authorLabel);

        const commentLabel = document.createElement('label');
        commentLabel.textContent = `Content${journal.comment}`;
        // newBlock.appendChild(commentLabel);

        if (journal.userId) {
            await fetchProfPic(journal.userId, newBlock);
            
        }
       
        container.appendChild(newBlock);
        newBlock.addEventListener('click', async () => {
            const clickedJournalId = journal.journalId;
            localStorage.setItem('journalId', clickedJournalId);
            window.location.href = 'userViewJournal.html';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    searchJournal("");

    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = searchInput.value;
            searchJournal(searchTerm);
        }
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim(); 
        if (searchTerm === '') {
            searchJournal("");
        } 
    });
});

async function searchJournal(searchTerm) {
    try {
        const response = await fetch('http://localhost:3000/searchJournal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm }),
        });

        const data = await response.json();

        if (data.success) {
            console.log(data.journal)
            populateJournalBlocks(data.journal);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
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














