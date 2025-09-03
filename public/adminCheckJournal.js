
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

function menu2(a){
    switch(a) {
        case 1:
        window.location.href = 'AdminBorrow.html'
        break;
        case 2:
        window.location.href = 'AdminReturn.html'
        break;
        default:
        break;
      }
}

async function addJournal(user_id,url,author,keywords,comment,coverPath) {
    try {
        await fetch('http://localhost:3000/addJournal1  ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id,url,author,keywords,comment,coverPath }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                
                if(data.message==="Successful"){
                    showDialog("Nice", data.message);
                }else{
                    showDialog("Opps", data.message);
                }
                
            } else {
                showDialog("Warning", error); // This line should be updated
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            showDialog("Error1", error); // This line should be updated
        });
    } catch (error) {
        console.error('Error:', error);
        showDialog("Error2", error); // This line should be updated
    }
}
getJournal()
async function getJournal() {
    try {
        const response = await fetch('http://localhost:3000/getJournal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(),
        });
        const data = await response.json();
        
        if (data.success) {
            const journals = data.message;
            console.log(journals);
            if (Array.isArray(journals)) {
                populateJournalBlocks(journals);
            } else {
                showDialog("Warning", "No journals found."); // Display warning message
            }
        } else {
            showDialog("Warning", data.error); // Display warning message
        }
    } catch (error) {
        console.error('Error:', error);
        showDialog("Error", error.message); // Display error message
    }
}

async function fetchProfilePic(userId, newBlock1) {
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
            newBlock1.appendChild(flexContainer);

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
        const newBlock1 = document.createElement('div');
        newBlock.classList.add('journal-block'); 
        newBlock1.classList.add('journal-block1'); 

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
        newBlock1.appendChild(imageContentDiv);
    

        const userLabel = document.createElement('label');
        userLabel.textContent = `User ID: ${journal.userId}`;
        newBlock1.appendChild(userLabel);

        // Check if URL is not null
        if (journal.url !== "") {
            const urlLabel = document.createElement('label');
            urlLabel.textContent = 'URL: '; 

            const urlLink = document.createElement('a');
            urlLink.textContent = journal.url; 
            urlLink.href = journal.url;
            urlLink.target = "_blank"; 

            newBlock1.appendChild(urlLabel); 
            newBlock1.appendChild(urlLink); 
        }

        const authorLabel = document.createElement('label');
        authorLabel.textContent = `Author: ${journal.author}`;
        newBlock1.appendChild(authorLabel);

        const keywordsLabel = document.createElement('label');
        keywordsLabel.textContent = `Title: ${journal.keywords}`;
        keywordsLabel.style.lineHeight = '1.5';
        newBlock1.appendChild(keywordsLabel);

        const commentLabel = document.createElement('label');
        commentLabel.textContent = `Content${journal.comment}`;
        // newBlock.appendChild(commentLabel);
        

        if (journal.userId) {
            await fetchProfilePic(journal.userId, newBlock1);

        }
        newBlock.appendChild(newBlock1);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('btn-container');

        const allowButton = document.createElement('button');
        allowButton.textContent = 'Allow';
        allowButton.classList.add('allow-button');

        allowButton.addEventListener('click', (event) => {
            event.preventDefault();
            addJournal(journal.userId, journal.url, journal.author, journal.keywords, journal.comment, journal.coverPath);
            removeJournal(journal.journalId);
            window.location.reload();
        });
        buttonContainer.appendChild(allowButton);

        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject';
        rejectButton.classList.add('reject-button');

        rejectButton.addEventListener('click', (event) => {
            event.preventDefault();
            removeJournal(journal.journalId);
        });
        buttonContainer.appendChild(rejectButton);
        newBlock1.addEventListener('click', async () => {
            const clickedJournalId = journal.journalId;
            localStorage.setItem('journalId', clickedJournalId);
            window.location.href = 'adminViewJournal.html';
        });
        
        newBlock.appendChild(buttonContainer);

        container.appendChild(newBlock);
        

    });
}

async function removeJournal(journal_id){
    try {
        const response = await fetch('http://localhost:3000/removeJournal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({journal_id}),
        });
        const data = await response.json();
        
        if (data.success) {
            window.location.reload(true);
            showDialog("牛逼", data.message);
        } else {
            showDialog("Warning1", data.error); 
        }
    } catch (error) {
        console.error('Error:', error);
        showDialog("Error", error.message); 
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














