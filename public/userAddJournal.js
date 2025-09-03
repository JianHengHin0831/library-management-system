const userId = localStorage.getItem('user_id');

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



async function addJournal() {
    const user_id = localStorage.getItem('user_id');
    const url = document.getElementById('url').value;
    const author = document.getElementById('author').value;
    const keywords = document.getElementById('keywords').value;
    const comment = document.getElementById('comment').value;
    const imageInput = document.getElementById('image');

    if (keywords==""||author==""||comment==""){
        showDialog("Opps", "Please fill in all the data")
        return;
    }

    var imageFile = imageInput.files[0];
    console.log(imageInput);
    if (imageFile === undefined) {
        const image = document.getElementById('image').src;
        imageFile = await fetchImageAsFile(image);
    }

    try {
        const response = await fetch('http://localhost:3000/addJournal', {
            method: 'POST',
            headers: {
                // Remove 'Content-Type': 'application/json' because you're sending FormData
            },
            body: createFormData(user_id, url, author, keywords, comment, imageFile),
        });
        const data = await response.json();
        if (data.success) {
            if (data.message === "Successful") {
                showDialog("Nice", data.message);
            } else {
                showDialog("Opps", data.message);
            }
        } else {
            showDialog("Warning", data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        showDialog("Error", error);
    }
}

function createFormData(user_id, url, author, keywords, comment, imageFile) {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('url', url);
    formData.append('author', author);
    formData.append('keywords', keywords);
    formData.append('comment', comment);
    formData.append('image', imageFile);
    return formData;
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