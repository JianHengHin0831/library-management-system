const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');



function changePassword(){
    window.location.href = 'forgotPw.html'
}

const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
const placeholderBlock = document.getElementById('placeholderBlock');

imageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) { 
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'flex';
            imagePreview.style.alignItems = 'center';
            imagePreview.style.justifyContent = 'center';
            imagePreview.style.textAlign = 'center';
            imagePreview.style.height = '100%';
            imagePreview.style.width = '100%';
            imagePreview.style.borderRadius = '50%';
            placeholderBlock.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        placeholderBlock.style.display = 'flex';
        placeholderBlock.style.flexDirection = 'column';
        placeholderBlock.style.textAlign = 'center';
        placeholderBlock.style.justifyContent = 'center';
        placeholderBlock.style.textAlign = 'center';
    }
}); 

async function fetchUserData(userId) {
    try {
      const response = await fetch('http://localhost:3000/fetchUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (data.success) {
        console.log('User data:', data.userData);
        updateUserDetails(data.userData);
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
    
    // updated (11/4/2024 5:39pm) 
   
        document.getElementById("imagePreview").src = "data:image/png;base64," + userData.profile_pic_base64;
        document.getElementById("imagePreview").style.display = "flex";
        document.getElementById("imagePreview").style.alignItems = "center";
        document.getElementById("imagePreview").style.justifyContent = "center";
        document.getElementById("imagePreview").style.textAlign = "center";
        document.getElementById("imagePreview").style.height = "100%";
        document.getElementById("imagePreview").style.width = "100%";
        document.getElementById("imagePreview").style.borderRadius = "50%";
        document.getElementById("placeholderBlock").style.display = "none";
//   document.getElementById("imagePreview").src = "data:image/png;base64," + userData.profile_pic_base64;
//   document.getElementById("imagePreview").style.display = "block";
//   document.getElementById('placeholderIcon').style.display = 'none';
//   document.getElementById('placeholderText').style.display = 'none';

    document.getElementById('user_id').value = userData.user_id;
    document.getElementById('name').value = userData.name;
    document.getElementById('email').value = userData.email;
    document.getElementById('contact').value = userData.contact_number;
    document.getElementById('course').value = userData.department;
    document.getElementById('degree').value = userData.degree;
    document.getElementById('role').value = userData.user_role;
    if (userData.department === "Unknown") {
      document.getElementById("course").disabled = false;
    } 
}

const userId = localStorage.getItem('user_id');
fetchUserData(userId); 

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

async function changeDetails() {
    const userId = document.getElementById('user_id').value;
    const name = document.getElementById('name').value;
    const contactNumber = document.getElementById('contact').value;
    const department = document.getElementById('course').value;
    const degree = document.getElementById('degree').value;
    const imageInput = document.getElementById('image');
    var imageFile = imageInput.files[0];
    if(imageFile===undefined){
      const image = document.getElementById('image').src;
      imageFile = await fetchImageAsFile(image); 
  }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', name);
    formData.append('contactNumber', contactNumber);
    formData.append('department', department);
    formData.append('degree', degree);
    formData.append('image', imageFile);

    try {
        const response = await fetch('http://localhost:3000/updateUser', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error updating user:', error);
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