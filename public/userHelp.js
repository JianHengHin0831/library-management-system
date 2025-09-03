const userId = localStorage.getItem('user_id');
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const menuText = document.querySelectorAll('.menuText');
const content = document.querySelector('section');

async function fetchIT() {
    try {
        const response = await fetch('http://localhost:3000/fetchIT', {
            method: 'POST'
        });
        const data = await response.json();
        if (data.success) { 
            console.log('User data:', data.userData);
            const { name, email,profile_pic,profile_pic_base64 } = data.userData;
            const imgElement = document.createElement('img');
            imgElement.src = `data:image/png;base64, ${profile_pic_base64}`;
            imgElement.alt = 'Profile Picture';
            imgElement.style.width='80px';
            imgElement.style.height='80px'
            document.getElementById("ITpicture").appendChild(imgElement);
    
            document.querySelector('.it_detail').innerHTML = `<p><b>IT Staff : </b>${name}<br><b>Email : </b>${email}</p>`;
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
} 
fetchIT();

async function fetchAdmin() {
    try {
        const response = await fetch('http://localhost:3000/fetchAdmin', {
            method: 'POST'
        });
        const data = await response.json();
        if (data.success) {
            console.log('User data:', data.userData);
            const { name, email,profile_pic,profile_pic_base64 } = data.userData;
            const imgElement = document.createElement('img');
            imgElement.src = `data:image/png;base64, ${profile_pic_base64}`;
            imgElement.alt = 'Profile Picture';
            imgElement.style.width='80px';
            imgElement.style.height='80px';
            imgElement.style.borderRadius = '50%';
            document.getElementById("LibPicture").appendChild(imgElement);

            document.querySelector('.lib_detail').innerHTML = `<p><b>Librarian : </b>${name}<br><b>Email : </b>${email}</p>`;
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
fetchAdmin();

var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
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

